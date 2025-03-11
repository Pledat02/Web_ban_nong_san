package com.example.notification_service.controller;

import com.example.notification_service.dto.request.OtpRequest;
import com.example.notification_service.dto.request.OtpVerificationRequest;
import com.example.notification_service.dto.response.ApiResponse;
import com.example.notification_service.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PathVariable;
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
    @PostMapping("/{userId}/verify-phone-otp")
    public ApiResponse<String> verifyPhoneOtp(@PathVariable String userId, @RequestBody OtpVerificationRequest request){
        return ApiResponse.<String>builder()
                .data(otpService.verifyPhoneOtp(request,userId))
                .build();
    }
    // send email otp
    @PostMapping("/send-email-otp")
    public ApiResponse<Void> sendEmailOtp(@RequestBody OtpRequest email ){
        otpService.sendOtpMail(email);
        return ApiResponse.<Void>builder().build();
    }
    // verify email otp
    @PostMapping("/{userId}/verify-email-otp")
    public ApiResponse<Boolean> verifyEmailOtp(@PathVariable String userId, @RequestBody OtpVerificationRequest request){
        return ApiResponse.<Boolean>builder()
               .data(otpService.verifyEmailOtp( request,userId))
               .build();
    }

}
