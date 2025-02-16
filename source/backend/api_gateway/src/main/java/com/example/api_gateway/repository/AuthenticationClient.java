package com.example.api_gateway.repository;

import com.example.api_gateway.dto.request.TokenRequest;
import com.example.api_gateway.dto.response.ApiResponse;
import com.example.api_gateway.dto.response.ValidTokenResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

public interface AuthenticationClient {
        @PostExchange(url = "/auth/introspect", contentType = MediaType.APPLICATION_JSON_VALUE)
        Mono<ApiResponse<ValidTokenResponse>> introspect(@RequestBody TokenRequest request);
}
