package com.example.profile_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "Profile")
public class Profile {
    @Id
    String userId;
    String firstName;
    String lastName;
    String address;
    String email;
    String phone;
    String thumbnail;
}
