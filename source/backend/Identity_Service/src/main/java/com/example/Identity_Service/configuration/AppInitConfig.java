package com.example.Identity_Service.configuration;

import com.example.Identity_Service.constant.PredefinedRole;
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
            Optional<Role> adminRoleOptional = roleRepository.findById(PredefinedRole.ADMIN_ROLE);
            Role adminRole;
            if (adminRoleOptional.isEmpty()) {
                adminRole = Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Administrator role")
                        .build();
                roleRepository.save(adminRole);
                log.info("Admin role created.");
            } else {
                adminRole = adminRoleOptional.get();
            }

            // Create admin user if not exists
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User user = User.builder()
                        .username("admin1")
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("admin123")) // Set a secure default password
                        .roles(new HashSet<>(Set.of(adminRole)))
                        .build();
                userRepository.save(user);

            }
        };
    }
}
