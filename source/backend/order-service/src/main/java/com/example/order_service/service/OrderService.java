package com.example.order_service.service;

import com.example.event.dto.*;
import com.example.order_service.dto.request.OrderItemRequest;
import com.example.order_service.dto.request.OrderRequest;
import com.example.order_service.dto.request.ShippingRequest;
import com.example.order_service.dto.response.OrderResponse;
import com.example.order_service.dto.response.OrderStatusResponse;
import com.example.order_service.dto.response.PageResponse;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import com.example.order_service.enums.OrderStatus;
import com.example.order_service.exception.AppException;
import com.example.order_service.exception.ErrorCode;
import com.example.order_service.mapper.OrderItemMapper;
import com.example.order_service.mapper.OrderMapper;
import com.example.order_service.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {
    OrderRepository orderRepository;
    OrderMapper orderMapper;
    ProfileClientHttp profileClientHttp;
    OrderItemMapper orderItemMapper;
    KafkaTemplate<String, Object> kafkaTemplate;
    ProductClientHttp productClientHttp;
    ShippingClientHttp shippingClientHttp;

    @Value("${app.email-admin}")
    @NonFinal
    String adminEmail;
    @Value("${app.name-admin}")
    @NonFinal
    String adminName;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        Order order = orderMapper.toOrder(request);
        // Kiểm tra hàng hóa đã hết hàng
        List<String> outOfStockProducts = productClientHttp.isStock(request.getOrderItems()).getData();
        if (!outOfStockProducts.isEmpty()) {
            throw new AppException(ErrorCode.OUT_OF_STOCK, String.join(", ", outOfStockProducts));
        }
        // Tạo danh sách cập nhật tồn kho
        UpdateStockRequest listUpdations = new UpdateStockRequest(new ArrayList<>());
        List<OrderItem> orderItems = new ArrayList<>();

        if (request.getOrderItems() != null) {
            for (OrderItemRequest itemRequest : request.getOrderItems()) {
                OrderItem orderItem = orderItemMapper.toOrderItem(itemRequest);
                orderItem.setOrder(order);
                orderItems.add(orderItem);
                // Thêm thông tin cập nhật tồn kho (giảm tồn kho)
                listUpdations.getItems().add(new ItemUpdateStock(
                        Long.parseLong(itemRequest.getProductCode()),
                        -itemRequest.getQuantity(),
                        itemRequest.getWeight()));
            }
        }
        order.setOrderItems(orderItems);
        // Lưu Order vào database
        order = orderRepository.save(order);
        // Gửi danh sách cập nhật tồn kho đến Kafka
        kafkaTemplate.send("update-stock", listUpdations);
        //     Gửi thông báo cho user về hủy đơn hàng
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .nameReceptor(adminName)
                .emailReceptor(adminEmail)
                .subject("Đơn hàng mới: " + order.getId_order())
                .textContent(String.format(
                        "Đơn hàng mới (%s) được tạo bởi người dùng %s với trạng thái %s vào lúc %s.",
                        order.getId_order(),
                        order.getId_user(),
                        OrderStatus.fromCode(order.getStatus()).name(),
                        LocalDate.now()
                ))
                .build();
        kafkaTemplate.send("notification-requests", notificationRequest);
        return orderMapper.toOrderResponse(order);
    }

    // Helper method to restore stock
    private void restoreStock(Order order) {
        UpdateStockRequest restoreRequest = new UpdateStockRequest(new ArrayList<>());
        for (OrderItem item : order.getOrderItems()) {
            restoreRequest.getItems().add(new ItemUpdateStock(
                    item.getProductCode(),
                    item.getQuantity(),
                    item.getWeight()));
        }
        kafkaTemplate.send("update-stock", restoreRequest);
        log.info("Restored stock for order {}", order.getId_order());
    }

    @Transactional
    public OrderResponse confirmOrderByCustomer(String id_Order) {
        // Kiểm tra quyền sở hữu đơn hàng
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getClaim("id_user");

        if (isOrderOwner(id_Order, userId)) {
            throw new AppException(ErrorCode.USER_NOT_AUTHORIZED, "Bạn không có quyền xác nhận đơn hàng này");
        }

        Order order = orderRepository.findById(id_Order)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.DELIVERED.getCode()) {
            throw new AppException(ErrorCode.INVALID_STATUS, "Đơn hàng chưa được giao, không thể xác nhận");
        }

        order.setStatus(OrderStatus.CONFIRMED_BY_CUSTOMER.getCode());
        order = orderRepository.save(order);

        // Gửi thông báo xác nhận
        var userProfile = profileClientHttp.getProfile(order.getId_user()).getData();
        String name = userProfile.getFirstName() + userProfile.getLastName();
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .nameReceptor(name)
                .emailReceptor(userProfile.getEmail())
                .subject("Xác nhận đơn hàng: " + order.getId_order())
                .textContent(String.format(
                        "Kính gửi %s, bạn đã xác nhận nhận hàng cho đơn hàng (%s) vào lúc %s.",
                        name,
                        order.getId_order(),
                        java.time.LocalDateTime.now()
                ))
                .build();
        kafkaTemplate.send("notification-requests", notificationRequest);
        log.info("Đã gửi thông báo Kafka cho người dùng về xác nhận đơn hàng {}", order.getId_order());

        return orderMapper.toOrderResponse(order);
    }
    // User role
    @Transactional
    public OrderResponse updateStatusCancelOrder(String id_Order) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getClaim("id_user");

        if (isOrderOwner(id_Order, userId)) {
            throw new AppException(ErrorCode.USER_NOT_AUTHORIZED, "Bạn không có quyền xác nhận đơn hàng này");
        }
        Order order = orderRepository.findById(id_Order).orElseThrow(
                () -> new AppException(ErrorCode.ORDER_NOT_FOUND)
        );
        if (order.getStatus() != OrderStatus.PENDING_CONFIRMATION.getCode()
                && order.getStatus() != OrderStatus.WAITING_FOR_PICKUP.getCode()) {
            throw new AppException(ErrorCode.CANNOT_CANCEL_ORDER);
        }
        order.setStatus(OrderStatus.CANCELED.getCode());
        order = orderRepository.save(order);

        // Restore stock when order is canceled
        restoreStock(order);
//     Gửi thông báo cho user về hủy đơn hàng
        // Gửi thông báo Kafka cho người dùng
        var userProfile = profileClientHttp.getProfile(order.getId_user()).getData();
        String name =userProfile.getFirstName()+userProfile.getLastName();

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .nameReceptor(name)
                .emailReceptor(userProfile.getEmail())
                .subject("Đơn hàng đã hủy: " + order.getId_order())
                .textContent(String.format(
                        "Kính gửi %s, đơn hàng (%s) của bạn đã được hủy vào lúc %s.",
                        name,
                        order.getId_order(),
                        java.time.LocalDateTime.now()
                ))
                .build();
        kafkaTemplate.send("notification-requests", notificationRequest);
        log.info("Đã gửi thông báo Kafka cho người dùng về hủy đơn hàng {}", order.getId_order());
        return orderMapper.toOrderResponse(order);
    }

    // Admin role
    @Transactional
    public OrderResponse updateStatusOrder(String id_Order, String status) {

        Order order = orderRepository.findById(id_Order).orElseThrow(
                () -> new AppException(ErrorCode.ORDER_NOT_FOUND)
        );
        OrderStatus statusOrder = OrderStatus.fromCode(order.getStatus());
        OrderStatus newStatus = OrderStatus.valueOf(status);

        // Nếu trạng thái mới giống trạng thái cũ thì báo lỗi
        if (newStatus == statusOrder) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        // Check status transitions
        switch (statusOrder) {
            case PENDING_CONFIRMATION:
                if (newStatus == OrderStatus.WAITING_FOR_SHIPMENT) {
                    order.setStatus(OrderStatus.WAITING_FOR_SHIPMENT.getCode());
                    // Tạo đơn hàng GHTK
                    ShippingRequest request = ShippingRequest.builder()
                            .products(order.getOrderItems().stream().map(orderItemMapper::toOrderItemRequest).toList())
                            .order(orderMapper.toOrderRequest(order))
                            .build();
                    log.info(request.toString());
                    shippingClientHttp.createShippingOrder(request);
                } else if (newStatus == OrderStatus.CANCELED) {
                    order.setStatus(OrderStatus.CANCELED.getCode());
                    // Restore stock when order is canceled
                    restoreStock(order);
                } else {
                    throw new AppException(ErrorCode.INVALID_STATUS);
                }
                break;
            case WAITING_FOR_SHIPMENT:
                if (newStatus == OrderStatus.SHIPPING) {
                    order.setStatus(OrderStatus.SHIPPING.getCode());

                } else {
                    throw new AppException(ErrorCode.INVALID_STATUS);
                }
                break;
            case SHIPPING:
                if (newStatus != OrderStatus.DELIVERED) {
                    throw new AppException(ErrorCode.INVALID_STATUS);
                }
                order.setStatus(OrderStatus.DELIVERED.getCode());
                break;
            case DELIVERED:
                if (newStatus == OrderStatus.CONFIRMED_BY_CUSTOMER) {
                    order.setStatus(OrderStatus.CONFIRMED_BY_CUSTOMER.getCode());
                } else if (newStatus == OrderStatus.RETURN_APPROVED) {
                    order.setStatus(OrderStatus.RETURN_APPROVED.getCode());
                } else {
                    throw new AppException(ErrorCode.INVALID_STATUS);
                }
                break;
            case CONFIRMED_BY_CUSTOMER:
                if (newStatus == OrderStatus.RETURN_REQUESTED) {
                    order.setStatus(OrderStatus.RETURN_REQUESTED.getCode());
                } else {
                    throw new AppException(ErrorCode.INVALID_STATUS);
                }
                break;
            case RETURN_REQUESTED:
                if (newStatus == OrderStatus.RETURN_APPROVED) {
                    order.setStatus(OrderStatus.RETURN_APPROVED.getCode());
                } else {
                    throw new AppException(ErrorCode.INVALID_STATUS);
                }
                break;
            case RETURN_APPROVED:
                if (newStatus != OrderStatus.RETURNED) {
                    throw new AppException(ErrorCode.INVALID_STATUS);
                }
                order.setStatus(OrderStatus.RETURNED.getCode());
                // Restore stock when order is returned
                restoreStock(order);
                break;
            default:
                throw new AppException(ErrorCode.INVALID_STATUS);
        }

        var userProfile = profileClientHttp.getProfile(order.getId_user()).getData();
        String name = userProfile.getFirstName() + userProfile.getLastName();
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .nameReceptor(name)
                .emailReceptor(userProfile.getEmail())
                .subject("Cập nhật trạng thái đơn hàng: " + order.getId_order())
                .textContent(String.format(
                        "Kính gửi %s, đơn hàng (%s) của bạn đã được cập nhật trạng thái thành %s vào lúc %s.",
                        name,
                        order.getId_order(),
                        newStatus.getDescription(), // Sử dụng description để hiển thị tiếng Việt
                        java.time.LocalDateTime.now()
                ))
                .build();
        kafkaTemplate.send("notification-requests", notificationRequest);
        return orderMapper.toOrderResponse(orderRepository.save(order));
    }
    public OrderResponse getOrderById(String orderId) {
        Order order = updateOrderStatusFromGHTK(orderId);
        log.info("order {}", order);
        OrderResponse response = orderMapper.toOrderResponse(order);

        response.setCustomer(profileClientHttp.getProfile(order.getId_user()).getData());
        return response;
    }

    public void deleteOrder(String orderId) {
        orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        orderRepository.deleteById(orderId);
    }

    public PageResponse<OrderResponse> getOrdersByUserId(String userId, int page, int size, Integer status) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Order> orderPage = orderRepository.findAllOrderByUserId(userId, status, pageable);

        return getPaginateOrderResponse(page, orderPage);
    }

    public PageResponse<OrderResponse> getAllOrders(int page, int size, String query) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("order_date").descending());

        Page<Order> orderPage = orderRepository.searchByQuery(pageable, query);
        for (Order order : orderPage) {
            updateOrderStatusFromGHTK(order.getId_order());
        }
        return getPaginateOrderResponse(page, orderPage);
    }

    public PageResponse<OrderResponse> getPaginateOrderResponse(int page, Page<Order> orderPage) {
        List<OrderResponse> orderResponses = orderPage.getContent()
                .stream()
                .map(orderMapper::toOrderResponse)
                .toList();
        return PageResponse.<OrderResponse>builder()
                .currentPage(page)
                .totalPages(orderPage.getTotalPages())
                .totalElements(orderPage.getTotalElements())
                .elements(orderResponses)
                .build();
    }

    public PageResponse<OrderResponse> getMyOrder(
            int page,
            int size,
            Integer status
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String idUser = jwt.getClaim("id_user");
        return getOrdersByUserId(idUser, page, size, status);
    }

    public Order updateOrderStatusFromGHTK(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Nếu trạng thái yêu cầu admin duyệt thì không cần lấy trạng thái từ GHTK
        if (order.getStatus() == OrderStatus.PENDING_CONFIRMATION.getCode()
                || order.getStatus() == OrderStatus.RETURN_REQUESTED.getCode()
                || order.getStatus() == OrderStatus.DELIVERED.getCode()
                || order.getStatus() == OrderStatus.CANCELED.getCode()
                || order.getStatus() == OrderStatus.CONFIRMED_BY_CUSTOMER.getCode()) {
            return order;
        }

        // Gọi API từ GHTK
        OrderStatusResponse response = shippingClientHttp.getShippingStatus(orderId).getData();
        log.info(response.toString());
        if (response.isSuccess() && response.getOrder() != null) {
            int ghtkStatus = response.getOrder().getStatus();
            OrderStatus mappedStatus = OrderStatus.fromGHTKStatus(ghtkStatus);

            // Chỉ cập nhật nếu trạng thái thay đổi
            if (order.getStatus() != mappedStatus.getCode()) {
                log.info("Cập nhật trạng thái đơn hàng {} từ {} -> {}",
                        orderId, order.getStatus(), mappedStatus.getCode());

                order.setStatus(mappedStatus.getCode());
                orderRepository.save(order);
            }
        } else {
            log.warn("Không thể lấy trạng thái đơn hàng từ GHTK: {}", response.getMessage());
        }
        return order;
    }

    public boolean isOrderOwner(String orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return !order.getId_user().equals(userId);
    }
}