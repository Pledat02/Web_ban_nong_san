package com.example.notification_service.controller;

import com.example.notification_service.dto.request.OtpRequest;
import com.example.notification_service.dto.request.OtpVerificationRequest;
import com.example.notification_service.dto.response.ApiResponse;
import com.example.notification_service.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class OtpController {
    OtpService otpService;

    @PostMapping("/send-phone-otp")
    public ApiResponse<Void> sendPhoneOtp(@RequestBody OtpRequest request) {
        try {
            otpService.sendPhoneOtp(request);
            return ApiResponse.<Void>builder()
                    .message("Mã OTP đã được gửi thành công")
                    .code(1000)  // Thành công
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .message("Gửi mã OTP thất bại" )
                    .code(5000)  // Lỗi server
                    .build();
        }
    }

    @PostMapping("/verify-phone-otp/{userId}")
    public ApiResponse<String> verifyPhoneOtp(@PathVariable String userId, @RequestBody OtpVerificationRequest request) {
        try {
            String result = otpService.verifyPhoneOtp(request, userId);
            return ApiResponse.<String>builder()
                    .data(result)
                    .message("Xác thực mã OTP thành công")
                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .message("Xác thực OTP thất bại")
                    .code(5001)
                    .build();
        }
    }

    @PostMapping("/send-email-otp")
    public ApiResponse<Void> sendEmailOtp(@RequestBody OtpRequest email) {
        try {
            otpService.sendOtpMail(email);
            return ApiResponse.<Void>builder()
                    .message("Mã OTP qua email đã được gửi thành công")
                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .message("Gửi OTP qua email thất bại: " + e.getMessage())
                    .code(5002)
                    .build();
        }
    }

    @PostMapping("/verify-email-otp/{userId}")
    public ApiResponse<String> verifyEmailOtp(@PathVariable String userId, @RequestBody OtpVerificationRequest request) {
        try {
            String isVerified = otpService.verifyEmailOtp(request, userId);
            return ApiResponse.<String>builder()
                    .data(isVerified)
                    .message("Xác thực OTP qua email thành công")
                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .message("Xác thực OTP qua email thất bại: " + e.getMessage())
                    .code(5003)
                    .build();
        }
    }
}
