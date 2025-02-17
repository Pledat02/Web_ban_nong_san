package com.example.notification_service.controller;

import com.example.notification_service.dto.request.SendMailRequest;
import com.example.notification_service.dto.response.ApiResponse;
import com.example.notification_service.dto.response.SendMailResponse;
import com.example.notification_service.service.SendMailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class SendMailController {
    SendMailService sendMailService;
    // Send email
    @PostMapping("/send-email")
    public ApiResponse<SendMailResponse> sendMail(@RequestBody SendMailRequest request){
        return ApiResponse.<SendMailResponse>builder()
               .data(sendMailService.sendMail(request))
               .build();
    }
    @KafkaListener(topics = "user-created")
    public void listen(String message){
        log.info(message);
    }
}
