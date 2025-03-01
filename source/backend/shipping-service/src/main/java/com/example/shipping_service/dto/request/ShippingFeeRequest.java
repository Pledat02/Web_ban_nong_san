package com.example.shipping_service.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ShippingFeeRequest {
    private String address;
    private String province;
    private String district;
    private double weight;
    private double value;
    @Builder.Default
    private String deliverOption ="none";
}
