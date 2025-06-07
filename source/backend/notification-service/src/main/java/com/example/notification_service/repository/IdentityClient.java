package com.example.notification_service.repository;

import com.example.notification_service.dto.response.ApiResponse;
import com.example.notification_service.dto.response.SendMailResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "identity-service", url ="${app.identity.url}")
public interface IdentityClient {
    @PostMapping(value = "/check-exists-email",produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<Boolean> checkEmail(
            @RequestParam("email") String email  );
}
