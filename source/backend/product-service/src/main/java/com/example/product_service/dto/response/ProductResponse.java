package com.example.product_service.dto.response;

import com.example.product_service.entity.ProductOption;
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
    String description;
    int average_rating;
    List<ReviewResponse> reviews;
    String category;
    String image;
    boolean isOrganic;
    List<ProductOption> options;
}
