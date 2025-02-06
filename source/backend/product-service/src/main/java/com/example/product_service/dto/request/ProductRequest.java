package com.example.product_service.dto.request;

import com.example.product_service.entity.OptionType;
import com.example.product_service.entity.ProductOption;
import jakarta.persistence.ManyToMany;

import java.util.List;

public class ProductRequest {
    long id_product;
    String name;
    Double price;
    String description;
    String category;
    String image;
    boolean isOrganic;
    @ManyToMany
    List<ProductOption> options;
}
