package com.example.notification_service.service;

import com.example.notification_service.configuration.TwilioConfig;
import com.example.notification_service.dto.request.OtpRequest;
import com.example.notification_service.dto.request.OtpVerificationRequest;
import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpService {

    final TwilioConfig twilioConfig;

    @Value("${app.otp.expiration}")
    int otpExpirationMinutes;

    public void sendPhoneOtp(OtpRequest request) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());

        Verification verification = Verification.creator(
                twilioConfig.getServiceSid(), // Dùng Service SID của bạn
                request.getPhone(),
                "sms" // Gửi OTP qua SMS
        ).create();

        System.out.println("OTP sent: " + verification.getSid());
    }

    public boolean verifyPhoneOtp(OtpVerificationRequest otpVerificationRequest) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());

        VerificationCheck verificationCheck = VerificationCheck.creator(
                        twilioConfig.getServiceSid()) // Dùng Service SID của bạn
                .setTo(otpVerificationRequest.getPhone())
                .setCode(otpVerificationRequest.getOtp())
                .create();

        System.out.println("Verification status: " + verificationCheck.getStatus());

        return "approved".equals(verificationCheck.getStatus());
    }
}
