package com.example.notification_service.service;

import com.example.event.dto.ChangeEmailRequest;
import com.example.event.dto.ChangePhoneRequest;
import com.example.event.dto.ResetPasswordRequest;
import com.example.notification_service.configuration.TwilioConfig;
import com.example.notification_service.dto.request.*;
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
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.kafka.support.SendResult;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpService {

    final TwilioConfig twilioConfig;
    final KafkaTemplate<String, Object> kafkaTemplate;
    final SendEmailClient sendEmailClient;
    private static final String RESET_PASSWORD_TOPIC = "reset-password-topic";
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
                .subject("Mã OTP xác nhận email của bạn")
                .textContent("Mã OTP của bạn là: " + otp)
                .build();

        try {
             sendEmailClient.sendMail(apiKey, mailRequest);
        } catch (FeignException e) {
            e.printStackTrace();
        }
    }

    public String verifyEmailOtp(OtpVerificationRequest request, String userId) {
        String storedOtp = otpStorage.get(request.getEmail());

        if (storedOtp != null && storedOtp.equals(request.getOtp())) {
            ChangeEmailRequest changeEmailRequest = ChangeEmailRequest.builder()
                    .userId(userId)
                    .email(request.getEmail())
                    .build();

            CompletableFuture<SendResult<String, Object>> future =
                    kafkaTemplate.send("change-email", changeEmailRequest);

            String resultMessage = future.handle((result, ex) -> {
                if (ex == null) {
                    otpStorage.remove(request.getEmail()); // Xóa OTP sau khi gửi Kafka thành công
                    return "Xác thực OTP thành công. Yêu cầu thay đổi email đã được gửi.";
                } else {
                    return ex.getMessage();
                }
            }).join(); // Chờ kết quả

            return resultMessage;
        }

        return "OTP không hợp lệ hoặc đã hết hạn.";
    }
    public void sendForgotPasswordMail(OtpRequest request) {
        String otp = generateOtp();

        // Lưu OTP vào bộ nhớ tạm
        otpStorage.put(request.getEmail(), otp);

        MailRequest mailRequest = MailRequest.builder()
                .sender(Sender.builder().name(nameSender).email(emailSender).build())
                .to(Collections.singletonList(
                        Recipient.builder().name("User").email(request.getEmail()).build()))
                .subject("Quên mật khẩu - OTP đặt lại mật khẩu")
                .textContent("Mã OTP để đặt lại mật khẩu của bạn là: " + otp)
                .build();

        try {
            sendEmailClient.sendMail(apiKey, mailRequest);
        } catch (FeignException e) {
            e.printStackTrace();
        }
    }

    public String verifyForgotPasswordOtp(OtpVerificationRequest request) {
        String storedOtp = otpStorage.get(request.getEmail());

        if (storedOtp != null && storedOtp.equals(request.getOtp())) {

            return "Xác thực OTP thành công. Bạn có thể đặt lại mật khẩu.";
        }

        return "OTP không hợp lệ hoặc đã hết hạn.";
    }
    public String updatePassword(SendResetPasswordRequest request) {
        String storedOtp = otpStorage.get(request.getEmail());

        if (storedOtp != null && storedOtp.equals(request.getOtp())) {
            ResetPasswordRequest event = new ResetPasswordRequest(request.getEmail(), request.getPassword());
            kafkaTemplate.send(RESET_PASSWORD_TOPIC, event);
            otpStorage.remove(request.getEmail());
            return "Cập nhật mật khẩu thành công.";
        }

        return "OTP không hợp lệ hoặc đã hết hạn.";
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

    public String verifyPhoneOtp(OtpVerificationRequest otpVerificationRequest, String userId) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());

        // Kiểm tra OTP qua Twilio
        VerificationCheck verificationCheck = VerificationCheck.creator(
                        twilioConfig.getServiceSid())
                .setTo(otpVerificationRequest.getPhone())
                .setCode(otpVerificationRequest.getOtp())
                .create();

        System.out.println("Verification status: " + verificationCheck.getStatus());

        if (!"approved".equals(verificationCheck.getStatus())) {
            return "OTP không hợp lệ hoặc đã hết hạn.";
        }

        // Gửi Kafka
        ChangePhoneRequest changePhoneRequest = ChangePhoneRequest.builder()
                .phone(otpVerificationRequest.getPhone())
                .userId(userId)
                .build();

        try {
            CompletableFuture<SendResult<String, Object>> future
                    = kafkaTemplate.send("change-phone", changePhoneRequest);
            return future.handle((result, ex) -> {
                if (ex == null) {
                    return "Xác thực OTP thành công. Yêu cầu thay đổi số điện thoại đã được gửi.";
                } else {
                    return ex.getMessage();
                }
            }).join();


        } catch (Exception e) {
            System.err.println("Lỗi khi gửi Kafka: " + e.getMessage());
            return "Xác thực OTP thành công nhưng không thể gửi Kafka.";
        }
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
