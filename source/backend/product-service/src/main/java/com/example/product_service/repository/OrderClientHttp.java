package com.example.product_service.repository;

import com.example.product_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "order-service", url = "http://localhost:8086/orders"
)
public interface OrderClientHttp {
    @GetMapping(value = "/top-products-id",produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<Long>> getTopProductsId();
}
