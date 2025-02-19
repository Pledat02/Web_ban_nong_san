package com.example.product_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
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
    @ManyToOne
    Category category;
    String image;
    boolean isOrganic;
    String origin;
    String packaging;
    String brand;
    String howToUse;
    String howToPreserve;
    @ManyToMany()
    List<OptionType> options;

}
