package com.example.order_service.controller;

import com.example.order_service.dto.request.OrderRequest;
import com.example.order_service.dto.request.OrderStatusRequest;
import com.example.order_service.dto.response.ApiResponse;
import com.example.order_service.dto.response.OrderResponse;
import com.example.order_service.dto.response.PageResponse;
import com.example.order_service.exception.AppException;
import com.example.order_service.exception.ErrorCode;
import com.example.order_service.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderController {
    OrderService orderService;
    // Get all orders
    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ){
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.getAllOrders(page, size))
                .build();
    }
    // Get order by id
    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable String id){
        OrderResponse order = orderService.getOrderById(id);
        if(order == null) throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        return ApiResponse.<OrderResponse>builder()
               .data(order)
               .build();
    }
    // Get orders by customer id
    @GetMapping("/user/{userId}")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersByUserId(
            @PathVariable String userId,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ){
        return ApiResponse.<PageResponse<OrderResponse>>builder()
               .data(orderService.getOrdersByUserId(userId, page, size))
               .build();
    }
    // Create order
    @PostMapping
    public ApiResponse<OrderResponse> createOrder(
                                                  @RequestBody OrderRequest orderRequest){
        OrderResponse order = orderService.createOrder(orderRequest);
        return ApiResponse.<OrderResponse>builder()
                .data(order)
                .code(201)
                .build();
    }
    // Update order
    @PutMapping("/{id}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(
                                                  @PathVariable String id,
                                                  @RequestBody OrderStatusRequest request){
        OrderResponse order = orderService.updateStatus(id, request.getStatus());
        if(order == null) throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        return ApiResponse.<OrderResponse>builder()
               .data(order)
               .build();
    }
    // Delete order
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteOrder(@PathVariable String id){
        orderService.deleteOrder(id);
        return ApiResponse.<Void>builder()
               .build();
    }
    // search
    @GetMapping("/search")
    public ApiResponse<PageResponse<OrderResponse>> searchOrders(
            @RequestParam String query,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size){
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.searchOrders(query, page, size))
               .build();
    }
}
