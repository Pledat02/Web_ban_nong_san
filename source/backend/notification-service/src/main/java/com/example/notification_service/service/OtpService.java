package com.example.notification_service.service;

import com.example.event.dto.ChangeEmailRequest;
import com.example.event.dto.ChangePhoneRequest;
import com.example.notification_service.configuration.TwilioConfig;
import com.example.notification_service.dto.request.*;
import com.example.notification_service.dto.response.SendMailResponse;
import com.example.notification_service.repository.SendEmailClient;
import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpService {

    final TwilioConfig twilioConfig;
    final KafkaTemplate<String, Object> kafkaTemplate;
    final SendEmailClient sendEmailClient;
    final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    @Value("${app.mail.brevo.api-key}")
    String apiKey;
    @Value("${app.mail.brevo.name-sender}")
    String nameSender;
    @Value("${app.mail.brevo.email-sender}")
    String emailSender;

    public void sendOtpMail(OtpRequest request) {
        String otp = generateOtp();

        // Lưu OTP vào bộ nhớ tạm
        otpStorage.put(request.getEmail(), otp);

        MailRequest mailRequest = MailRequest.builder()
                .sender(Sender.builder().name(nameSender).email(emailSender).build())
                .to(Collections.singletonList(
                        Recipient.builder().name("User").email(request.getEmail()).build()))
                .subject("Mã OTP của bạn")
                .textContent("Mã OTP của bạn là: " + otp)
                .build();

        try {
             sendEmailClient.sendMail(apiKey, mailRequest);
        } catch (FeignException e) {
            e.printStackTrace();
        }
    }

    public boolean verifyEmailOtp(OtpVerificationRequest request,String userId) {
        String storedOtp = otpStorage.get(request.getEmail());

        if (storedOtp != null && storedOtp.equals(request.getOtp())) {
            kafkaTemplate.send("change-email",
                    ChangeEmailRequest.builder()
                           .userId(userId)
                           .email(request.getEmail())
                           .build());
            // Xóa OTP sau khi đã thay đổi email
            otpStorage.remove(request.getEmail());
            return true;
        }
        return false;
    }
    public void sendPhoneOtp(OtpRequest request) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());

        Verification verification = Verification.creator(
                twilioConfig.getServiceSid(), // Dùng Service SID của bạn
                request.getPhone(),
                "sms" // Gửi OTP qua SMS
        ).create();

        System.out.println("OTP sent: " + verification.getSid());
    }

    public String verifyPhoneOtp(OtpVerificationRequest otpVerificationRequest,String userId) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());

        VerificationCheck verificationCheck = VerificationCheck.creator(
                        twilioConfig.getServiceSid()) // Dùng Service SID của bạn
                .setTo(otpVerificationRequest.getPhone())
                .setCode(otpVerificationRequest.getOtp())
                .create();

        System.out.println("Verification status: " + verificationCheck.getStatus());
        // send kafka
        ChangePhoneRequest changePhoneRequest =
                ChangePhoneRequest.builder()
                        .phone(otpVerificationRequest.getPhone())
                        .userId(userId)
                        .build();
        kafkaTemplate.send("change-phone", changePhoneRequest);
        return verificationCheck.getStatus();
    }
    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            otp.append(random.nextInt(10)); // Sinh số từ 0-9
        }
        return otp.toString();
    }


}
