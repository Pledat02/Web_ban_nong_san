package com.example.Identity_Service.configuration;

import com.example.Identity_Service.repository.RoleRepository;
import com.example.Identity_Service.repository.UserRepository;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Configuration
public class AppInitConfig {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner appRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            // Ensure "admin" role exists
            Optional<Role> adminRoleOptional = roleRepository.findById("admin");
            Role adminRole;
            if (adminRoleOptional.isEmpty()) {
                adminRole = Role.builder()
                        .name("admin")
                        .description("Administrator role")
                        .build();
                roleRepository.save(adminRole);
                log.info("Admin role created.");
            } else {
                adminRole = adminRoleOptional.get();
            }

            // Create admin user if not exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                User user = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123")) // Set a secure default password
                        .roles(new HashSet<>(Set.of(adminRole)))
                        .build();
                userRepository.save(user);
                log.warn("Admin user created with username 'admin' and default password 'admin123'.");
            }
        };
    }
}
