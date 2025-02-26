package com.example.shipping_service.dto.request;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShippingRequest {
    private String name;
    private String address;
    private String province;
    private String district;
    private String tel;
    private double weight;
    private double value;
}
