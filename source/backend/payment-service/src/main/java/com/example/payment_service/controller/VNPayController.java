package com.example.payment_service.controller;

import com.example.payment_service.dto.response.ApiResponse;
import com.example.payment_service.dto.response.VNPayResponse;
import com.example.payment_service.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/vnpay")
public class VNPayController {
    private final PaymentService paymentService;
    @GetMapping("/pay")
    public ApiResponse<VNPayResponse> pay(HttpServletRequest request) {
        return  ApiResponse.<VNPayResponse>
                builder()
                .code(201)
                .message("Payment success")
                .data(paymentService.createVnPayPayment(request))
                .build();

    }
    @GetMapping("/pay-callback")
    public ApiResponse<VNPayResponse> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if (status.equals("00")) {
            return ApiResponse.<VNPayResponse>
                     builder()
                    .code(200)
                    .message("00")
                    .data(new VNPayResponse("00", "Success", ""))
                    .build();
        } else {
            return  ApiResponse.<VNPayResponse>
                    builder()
                            .code(400)
                            .message("00")
                            .data(null)
                            .build();
        }
    }
}

