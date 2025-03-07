package com.example.product_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "WeightType")
public class WeightType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_weight_type;
    private double weight;
    private String unit;

}
