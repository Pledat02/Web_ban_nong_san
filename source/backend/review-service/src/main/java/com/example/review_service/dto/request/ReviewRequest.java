package com.example.review_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {
    long id_review;
    String content;
    int rating;
    long id_product;
    String id_user;
}
