package com.example.Identity_Service.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class AuthenicationRequest {
    @NotNull(message = "Tên người dùng không được để trống")
    @Size(min = 4, message = "USERNAME_INVALID")
    String username;
    @Size(min=8, message = "PASSWORD_INVALID")
    String password;

}
