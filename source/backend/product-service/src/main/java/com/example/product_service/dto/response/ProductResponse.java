package com.example.product_service.dto.response;

import com.example.product_service.dto.request.WeightTypeResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    long id_product;
    String name;
    Double price;
    Double oldPrice;
    String description;
    int average_rating;
    List<ReviewResponse> reviews;
    CategoryResponse category;
    String image;
    int stock;
    boolean organic;
    String origin;
    String packaging;
    String brand;
    String howToUse;
    String howToPreserve;
    List<WeightTypeResponse> weightTypes;
}
