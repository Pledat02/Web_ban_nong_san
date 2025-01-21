package com.example.Identity_Service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@Entity
@NoArgsConstructor
public class InvalidToken {
    @Id
    String token;
    Date expiredDate;
}
