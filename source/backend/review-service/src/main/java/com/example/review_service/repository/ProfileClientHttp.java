package com.example.review_service.repository;

import com.example.review_service.dto.response.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "profile-service", url = "http://localhost:8080/identity/users/reviewer")
public interface ProfileClientHttp {
    @GetMapping(value = "/{id_user}", produces = MediaType.APPLICATION_JSON_VALUE)
    ProfileResponse getProfile(@PathVariable String id_user);
}
