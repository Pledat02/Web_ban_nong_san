package com.example.shipping_service.controller;

import com.example.shipping_service.dto.request.ShippingFeeRequest;
import com.example.shipping_service.dto.request.ShippingRequest;
import com.example.shipping_service.dto.response.*;
import com.example.shipping_service.service.ShippingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ShippingController {
    private final ShippingService shippingService;

    @GetMapping("/cancel/{trackingOrder}")
    public CancelShippingResponse cancelOrder(@PathVariable String trackingOrder) {
        return shippingService.cancelShipping(trackingOrder);
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
        ShippingResponse response = null;
            response = shippingService.createShipping(request);
        return ApiResponse.<ShippingResponse>builder()
               .data(response)
               .build();
    }
    @GetMapping("fee")
    public ApiResponse<ShippingFeeResponse> getShippingFee(@RequestBody ShippingFeeRequest request) {
        ShippingFeeResponse fee = shippingService.getShippingFee(request);
        return ApiResponse.<ShippingFeeResponse>builder()
               .data(fee)
               .build();
    }

}
