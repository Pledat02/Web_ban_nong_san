package com.example.profile_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdationProfileRequest {
    String id_user;
    String firstName;
    String lastName;
    AddressRequest address;
    String email;
    String phone;
}
