package com.example.notification_service.controller;

import com.example.notification_service.dto.request.OtpRequest;
import com.example.notification_service.dto.request.OtpVerificationRequest;
import com.example.notification_service.dto.response.ApiResponse;
import com.example.notification_service.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
public class OtpController {
    OtpService otpService;

    @PostMapping("/send-phone-otp")
    public ApiResponse<Void> sendPhoneOtp(@RequestBody OtpRequest request){
        otpService.sendPhoneOtp(request);
        return ApiResponse.<Void>builder().build();
    }
    @PostMapping("/verify-phone-otp")
    public ApiResponse<Boolean> verifyPhoneOtp(@RequestBody OtpVerificationRequest request){
        otpService.verifyPhoneOtp(request);
        return ApiResponse.<Boolean>builder().build();
    }

}
