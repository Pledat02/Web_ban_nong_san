package com.example.product_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


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
    @ManyToOne
    Category category;
    String image;
    Boolean organic;
    String origin;
    String packaging;
    String brand;
    String howToUse;
    String howToPreserve;



}
