package com.example.api_gateway.service;

import com.example.api_gateway.dto.request.TokenRequest;
import com.example.api_gateway.dto.response.ApiResponse;
import com.example.api_gateway.dto.response.ValidTokenResponse;
import com.example.api_gateway.repository.AuthenticationClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    AuthenticationClient authenticationClient;
    public  Mono<ApiResponse<ValidTokenResponse>> introspect(String token){
            return authenticationClient.introspect(TokenRequest.builder()
                            .token(token)
                    .build());
    }

}
