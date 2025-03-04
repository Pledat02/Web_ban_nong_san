package com.example.Identity_Service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewerUserResponse {
    String id_user;
    String username;
    String avatar;
}
