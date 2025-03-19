package com.example.order_service.service;

import com.example.event.dto.ItemUpdateStock;
import com.example.event.dto.UpdateStockRequest;
import com.example.order_service.dto.request.OrderItemRequest;
import com.example.order_service.dto.request.OrderRequest;
import com.example.order_service.dto.response.OrderResponse;
import com.example.order_service.dto.response.PageResponse;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import com.example.order_service.exception.AppException;
import com.example.order_service.exception.ErrorCode;
import com.example.order_service.mapper.OrderItemMapper;
import com.example.order_service.mapper.OrderMapper;
import com.example.order_service.repository.OrderItemRepository;
import com.example.order_service.repository.OrderRepository;
import com.example.order_service.repository.ProductClientHttp;
import com.example.order_service.repository.ProfileClientHttp;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Map OrderRequest -> Order
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
                orderItem.setOrder(order); // Gán Order đã tạo vào OrderItem
                orderItems.add(orderItem);

                // Thêm thông tin cập nhật tồn kho
                listUpdations.getItems().add(new ItemUpdateStock(
                            Long.parseLong(itemRequest.getProductCode())
                            ,itemRequest.getQuantity()));
            }
        }
        order.setOrderItems(orderItems);

        // Lưu Order vào database
        order = orderRepository.save(order);

        // Gửi danh sách cập nhật tồn kho đến Kafka
        kafkaTemplate.send("update-stock", listUpdations);

        return orderMapper.toOrderResponse(order);
    }



    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        log.info("order"+order);
        OrderResponse response = orderMapper.toOrderResponse(order);

        response.setUser(profileClientHttp.getProfile(order.getId_user()).getData());
        return response;
    }

    public void deleteOrder(String orderId) {
        orderRepository.findById(orderId)
               .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        orderRepository.deleteById(orderId);
    }
    public PageResponse<OrderResponse> getOrdersByUserId(String userId,int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Order> orderPage = orderRepository.findAllOrderByUserId(userId,pageable);

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
    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Order> orderPage = orderRepository.findAll(pageable);

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
    // search
    public PageResponse<OrderResponse> searchOrders(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Order> orderPage = orderRepository.searchOrders(keyword, pageable);

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
    public OrderResponse updateStatus(String id_order, String status){
        Order order = orderRepository.findById(id_order)
               .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        order.setStatus(status);
        order = orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }
}
