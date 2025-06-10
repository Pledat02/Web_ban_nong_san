package com.example.notification_service.repository;

import com.example.notification_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "profile-service", url ="${app.profile.url}")
public interface ProfileClient {
    @PostMapping(value = "/check-exists-phone",produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<Boolean> checkPhone(
            @RequestParam("phone") String phone  );
}
