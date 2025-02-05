package com.example.Identity_Service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class RoleRequest {
    String name;
    String description;
    Set<String> permissons;
}
