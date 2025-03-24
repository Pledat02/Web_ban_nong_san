package com.example.Identity_Service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Set;

@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class RoleResponse implements Serializable {
    String name;
    String description;
    Set<PermissionResponse> permissons;
}
