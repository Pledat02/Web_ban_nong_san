package com.example.shipping_service.controller;

import com.example.shipping_service.dto.request.ShippingRequest;
import com.example.shipping_service.dto.response.ApiResponse;
import com.example.shipping_service.dto.response.OrderStatusResponse;
import com.example.shipping_service.dto.response.ShippingResponse;
import com.example.shipping_service.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shipping")
@RequiredArgsConstructor
public class ShippingController {
    private final ShippingService shippingService;

    @GetMapping("/cancel/{trackingOrder}")
    public ShippingResponse cancelOrder(@PathVariable String trackingOrder) {
        ShippingResponse response = shippingService.cancelShipping(trackingOrder);
        return response;
    }
    @GetMapping("/order-status/{trackingOrder}")
    public ApiResponse<OrderStatusResponse> getOrderStatus(@PathVariable String trackingOrder) {
        OrderStatusResponse response = shippingService.checkOrderStatus(trackingOrder);
        return ApiResponse.<OrderStatusResponse>builder()
                .data(response)
                .build();
    }
    @PostMapping("/create-order")
    public ApiResponse<ShippingResponse> createOrder(@RequestBody ShippingRequest request) {
        ShippingResponse response = shippingService.createShipping(request);
        return ApiResponse.<ShippingResponse>builder()
               .data(response)
               .build();
    }

}
