package com.example.Identity_Service.entity;

import jakarta.persistence.*;
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
@Entity(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id_user;
    String username;
    String email;
    String password;
    LocalDate birthday;
    @ManyToMany
    Set<Role> roles;

}