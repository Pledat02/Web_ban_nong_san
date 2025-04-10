package com.example.api_gateway.configuration;

import com.example.api_gateway.service.AuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationFilter implements GlobalFilter, Ordered {

    AuthService authService;

    public AuthenticationFilter(@Lazy AuthService authService) {
        this.authService = authService;
    }

    AntPathMatcher pathMatcher = new AntPathMatcher();

    @NonFinal
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/v1/identity/auth/**",
            "/api/v1/products/**",
            "/api/v1/reviews/product/**",
            "/api/v1/identity/users/registration",
            "/api/v1/notifications/**",
            "/api/v1/profiles/internal",
            "/api/v1/orders/**"
    );

    @NonFinal
    private static final List<String> GET_PUBLIC_ENDPOINTS = List.of(
            "/api/v1/products/**"

    );

    @Override
    public int getOrder() {
        return 0; // Chạy sau CorsWebFilter
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (isPublicEndpoint(exchange.getRequest())) {
            return chain.filter(exchange);
        }
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return getUnAuthentication(exchange.getResponse(), "Invalid or expired JWT token");
        } else {
            token = token.replace("Bearer ", "");
            return authService.introspect(token).flatMap(intro -> {
                if (intro.getData().isValid()) {
                    return chain.filter(exchange);
                } else {
                    return getUnAuthentication(exchange.getResponse(), "Invalid or expired JWT token");
                }
            });
        }
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        String method = String.valueOf(request.getMethod());
        log.info("Checking path: " + path + ", Method: " + method);

        if ("GET".equalsIgnoreCase(method) &&
                GET_PUBLIC_ENDPOINTS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path))) {
            log.info("Matched GET public endpoint: " + path);
            return true;
        }

        boolean isPublic = PUBLIC_ENDPOINTS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
        if (isPublic) {
            log.info("Matched public endpoint: " + path);
        }
        return isPublic;
    }

    private Mono<Void> getUnAuthentication(ServerHttpResponse response, String message) {
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        String errorMessage = "{\"error\":\"" + message + "\"}";
        byte[] bytes = errorMessage.getBytes(StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }

    private Mono<Void> getUnAuthorization(ServerHttpResponse response, String message) {
        response.setStatusCode(HttpStatus.FORBIDDEN);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        String errorMessage = "{\"error\":\"" + message + "\"}";
        byte[] bytes = errorMessage.getBytes(StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }
}