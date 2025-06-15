package com.example.order_service.controller;

import com.example.order_service.dto.request.OrderRequest;
import com.example.order_service.dto.response.ApiResponse;
import com.example.order_service.dto.response.OrderResponse;
import com.example.order_service.dto.response.PageResponse;
import com.example.order_service.exception.AppException;
import com.example.order_service.exception.ErrorCode;
import com.example.order_service.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    // Get all orders
    @GetMapping("")
    @CrossOrigin(value = "http://localhost:3000/,http://localhost:3001/,null", allowCredentials = "true")
//    @PreAuthorize("hasAuthority('READ_ORDER')or hasRole('MODERATOR') or hasRole('MANAGE_ORDER')")
    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false, defaultValue = "") String query) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.getAllOrders(page, size, query))
                .build();
    }

    // Get order by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_ORDER')")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable String id) {
        OrderResponse order = orderService.getOrderById(id);
        if (order == null) throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        return ApiResponse.<OrderResponse>builder()
                .data(order)
                .build();
    }

    // Get orders by customer ID
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('READ_ORDER')")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersByUserId(
            @PathVariable String userId,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.getOrdersByUserId(userId, page, size, status))
                .build();
    }

    // Get authenticated user's orders
    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<PageResponse<OrderResponse>> getMyOrder(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.getMyOrder(page, size, status))
                .build();
    }

    // Create order
    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse order = orderService.createOrder(orderRequest);
        return ApiResponse.<OrderResponse>builder()
                .data(order)
                .code(201)
                .build();
    }
    @PutMapping("/confirm/{id}")
    public ApiResponse<OrderResponse> confirmOrder(@PathVariable String id) {
        OrderResponse order = orderService.confirmOrderByCustomer(id);
        return ApiResponse.<OrderResponse>builder()
                .data(order)
                .build();
    }


    // Delete order
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_ORDER')")
    public ApiResponse<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ApiResponse.<Void>builder()
                .build();
    }

    // Cancel order (user must own the order)
    @PutMapping("/cancel/{id}")
    public ApiResponse<OrderResponse> cancelOrder(@PathVariable String id) {
        OrderResponse order = orderService.updateStatusCancelOrder(id);
        if (order == null) throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        return ApiResponse.<OrderResponse>builder()
                .data(order)
                .build();
    }

    // Update order status
    @PutMapping("/{id}/update-status")
    @PreAuthorize("hasAuthority('WRITE_ORDER')")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable String id,
                                                        @RequestParam String status) {
        OrderResponse order = orderService.updateStatusOrder(id, status);
        return ApiResponse.<OrderResponse>builder()
                .data(order)
                .build();
    }
}