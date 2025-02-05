package com.example.Identity_Service.dto.response;

import com.example.Identity_Service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    String username;
    String email;
    String password;
    LocalDate birthday;
    Set<Role> roles;
}
