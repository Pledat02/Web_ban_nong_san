package com.example.product_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WeightTypeResponse {
    private Long id_weight_type;
    private double value;
    private String unit;
}
