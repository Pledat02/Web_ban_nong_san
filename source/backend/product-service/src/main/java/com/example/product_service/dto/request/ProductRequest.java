package com.example.product_service.dto.request;

import com.example.product_service.entity.OptionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    long id_product;
    String name;
    Double price;
    String description;
    long id_category;
    String image;
    boolean isOrganic;
    String origin;
    String packaging;
    String brand;
    String howToUse;
    String howToPreserve;
    List<Long> id_options;
}
