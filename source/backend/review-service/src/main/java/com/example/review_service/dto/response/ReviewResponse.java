package com.example.review_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    long id_review;
    String id_user;
    String content;
    int rating;
    ProfileResponse profileResponse;
}
