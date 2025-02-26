package com.example.shipping_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShippingResponse {
    private boolean success;
    private String message;
    private Object data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingData {
        private String code;
        private String token;
    }
}

