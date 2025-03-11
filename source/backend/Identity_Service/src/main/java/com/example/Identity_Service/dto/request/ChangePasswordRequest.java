package com.example.Identity_Service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class ChangePasswordRequest {
    String id_user;
    String oldPassword;
    String newPassword;
    String confirmPassword;
}
