package com.example.Identity_Service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@Entity
@NoArgsConstructor
public class Role {
    @Id
    String name;
    String description;
    @ManyToMany
    Set<Permission> permissons;
}
