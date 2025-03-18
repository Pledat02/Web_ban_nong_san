package com.example.order_service.service;

import com.example.order_service.dto.request.OrderRequest;
import com.example.order_service.dto.request.OrderStatusRequest;
import com.example.order_service.dto.response.OrderResponse;
import com.example.order_service.dto.response.PageResponse;
import com.example.order_service.dto.response.ProfileResponse;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import com.example.order_service.exception.AppException;
import com.example.order_service.exception.ErrorCode;
import com.example.order_service.mapper.OrderItemMapper;
import com.example.order_service.mapper.OrderMapper;
import com.example.order_service.repository.OrderItemRepository;
import com.example.order_service.repository.OrderRepository;
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
    OrderItemRepository orderItemRepository;
    OrderItemMapper orderItemMapper;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Map OrderRequest -> Order
        Order order = orderMapper.toOrder(request);

        // Gán order vào từng OrderItem
        Order finalOrder = order;
        finalOrder.setOrderItems(new ArrayList<>());
        request.getOrderItems().forEach(itemRequest -> {
            OrderItem orderItem = orderItemMapper.toOrderItem(itemRequest);
            finalOrder.getOrderItems().add(orderItem);
            orderItem.setOrder(finalOrder);
        });

        order = orderRepository.save(order);
        OrderResponse result =   orderMapper.toOrderResponse(order);
        ProfileResponse profileResponse = profileClientHttp.getProfile(request.getUser().getId_user()).getData();
        log.info(profileResponse.toString());
        result.setUser(profileResponse);
        return result;
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
