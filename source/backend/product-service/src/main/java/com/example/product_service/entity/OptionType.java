package com.example.product_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "OptionType")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OptionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id_option;
    String name;
}
