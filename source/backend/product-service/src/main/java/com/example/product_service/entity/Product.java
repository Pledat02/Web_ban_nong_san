package com.example.product_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "Product")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id_product;
    String name;
    Double price;
    String description;
    Double oldPrice;
    int stock;
    @ManyToOne
    Category category;
    String image;
    Boolean organic;
    String origin;
    String packaging;
    String brand;
    String howToUse;
    String howToPreserve;
    @ManyToMany
    List<WeightType> weightTypes = new ArrayList<>();


}
