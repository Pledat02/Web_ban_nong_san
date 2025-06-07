package com.example.Identity_Service.configuration;

import com.example.Identity_Service.constant.PredefinedRole;
import com.example.Identity_Service.entity.Permission;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.repository.PermissionRepository;
import com.example.Identity_Service.repository.RoleRepository;
import com.example.Identity_Service.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Configuration
public class AppInitConfig {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Bean
    @Transactional
    ApplicationRunner appRunner() {
        return args -> {
            // Initialize permissions
            Set<Permission> allPermissions = new HashSet<>();
            String[][] permissionData = {
                    {"READ_USER", "Read user data"},
                    {"WRITE_USER", "Write user data"},
                    {"DELETE_USER", "Delete user data"},
                    {"READ_ROLE", "Read role data"},
                    {"WRITE_ROLE", "Write role data"},
                    {"DELETE_ROLE", "Delete role data"},
                    {"READ_PERMISSION", "Read permission data"},
                    {"WRITE_PERMISSION", "Write permission data"},
                    {"DELETE_PERMISSION", "Delete permission data"},
                    {"READ_PRODUCT", "Read product data"},
                    {"WRITE_PRODUCT", "Write product data"},
                    {"DELETE_PRODUCT", "Delete product data"},
                    {"READ_PROFILE", "Read profile data"},
                    {"WRITE_PROFILE", "Write profile data"},
                    {"DELETE_PROFILE", "Delete profile data"},
                    {"READ_ORDER", "Read order data"},
                    {"WRITE_ORDER", "Write order data"},
                    {"DELETE_ORDER", "Delete order data"}
            };

            for (String[] data : permissionData) {
                Permission permission = permissionRepository.findById(data[0])
                        .orElseGet(() -> {
                            Permission newPermission = Permission.builder()
                                    .name(data[0])
                                    .description(data[1])
                                    .build();
                            return permissionRepository.saveAndFlush(newPermission);
                        });
                allPermissions.add(permission);
                log.info("Permission {} {}", data[0], permissionRepository.findById(data[0]).isPresent() ? "already exists" : "created");
            }

            // Initialize roles
            // MODERATOR: All permissions
            Role moderatorRole = roleRepository.findByIdWithPermissions(PredefinedRole.MODERATOR_ROLE)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(PredefinedRole.MODERATOR_ROLE)
                                .description("Moderator role with full access")
                                .permissions(new HashSet<>(allPermissions))
                                .isActive(true)
                                .createAt(Timestamp.valueOf(LocalDateTime.now()))
                                .build();
                        return roleRepository.saveAndFlush(newRole);
                    });
            log.info("Moderator role {}", roleRepository.findById(PredefinedRole.MODERATOR_ROLE).isPresent() ? "already exists" : "created");

            // USER: READ_USER, WRITE_USER, READ_PROFILE, WRITE_PROFILE
            Set<Permission> userPermissions = new HashSet<>();
            userPermissions.add(permissionRepository.findById("READ_USER").orElseThrow());
            userPermissions.add(permissionRepository.findById("WRITE_USER").orElseThrow());
            userPermissions.add(permissionRepository.findById("READ_PROFILE").orElseThrow());
            userPermissions.add(permissionRepository.findById("WRITE_PROFILE").orElseThrow());

            Role userRole = roleRepository.findByIdWithPermissions(PredefinedRole.USER_ROLE)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(PredefinedRole.USER_ROLE)
                                .description("User role with limited access")
                                .permissions(new HashSet<>(userPermissions))
                                .isActive(true)
                                .createAt(Timestamp.valueOf(LocalDateTime.now()))
                                .build();
                        return roleRepository.saveAndFlush(newRole);
                    });
            log.info("User role {}", roleRepository.findById(PredefinedRole.USER_ROLE).isPresent() ? "already exists" : "created");

            // MANAGE_USER: READ_USER, WRITE_USER, DELETE_USER
            Set<Permission> manageUserPermissions = new HashSet<>();
            manageUserPermissions.add(permissionRepository.findById("READ_USER").orElseThrow());
            manageUserPermissions.add(permissionRepository.findById("WRITE_USER").orElseThrow());
            manageUserPermissions.add(permissionRepository.findById("DELETE_USER").orElseThrow());

            Role manageUserRole = roleRepository.findByIdWithPermissions(PredefinedRole.MANAGE_USER_ROLE)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(PredefinedRole.MANAGE_USER_ROLE)
                                .description("Role for managing users")
                                .permissions(new HashSet<>(manageUserPermissions))
                                .isActive(true)
                                .createAt(Timestamp.valueOf(LocalDateTime.now()))
                                .build();
                        return roleRepository.saveAndFlush(newRole);
                    });
            log.info("Manage User role {}", roleRepository.findById(PredefinedRole.MANAGE_USER_ROLE).isPresent() ? "already exists" : "created");

            // MANAGE_ROLE: READ_ROLE, WRITE_ROLE, DELETE_ROLE
            Set<Permission> manageRolePermissions = new HashSet<>();
            manageRolePermissions.add(permissionRepository.findById("READ_ROLE").orElseThrow());
            manageRolePermissions.add(permissionRepository.findById("WRITE_ROLE").orElseThrow());
            manageRolePermissions.add(permissionRepository.findById("DELETE_ROLE").orElseThrow());

            Role manageRole = roleRepository.findByIdWithPermissions(PredefinedRole.MANAGE_ROLE_ROLE)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(PredefinedRole.MANAGE_ROLE_ROLE)
                                .description("Role for managing roles")
                                .permissions(new HashSet<>(manageRolePermissions))
                                .isActive(true)
                                .createAt(Timestamp.valueOf(LocalDateTime.now()))
                                .build();
                        return roleRepository.saveAndFlush(newRole);
                    });
            log.info("Manage Role role {}", roleRepository.findById(PredefinedRole.MANAGE_ROLE_ROLE).isPresent() ? "already exists" : "created");

            // MANAGE_PERMISSION: READ_PERMISSION, WRITE_PERMISSION, DELETE_PERMISSION
            Set<Permission> managePermissionPermissions = new HashSet<>();
            managePermissionPermissions.add(permissionRepository.findById("READ_PERMISSION").orElseThrow());
            managePermissionPermissions.add(permissionRepository.findById("WRITE_PERMISSION").orElseThrow());
            managePermissionPermissions.add(permissionRepository.findById("DELETE_PERMISSION").orElseThrow());

            Role managePermissionRole = roleRepository.findByIdWithPermissions(PredefinedRole.MANAGE_PERMISSION_ROLE)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(PredefinedRole.MANAGE_PERMISSION_ROLE)
                                .description("Role for managing permissions")
                                .permissions(new HashSet<>(managePermissionPermissions))
                                .isActive(true)
                                .createAt(Timestamp.valueOf(LocalDateTime.now()))
                                .build();
                        return roleRepository.saveAndFlush(newRole);
                    });
            log.info("Manage Permission role {}", roleRepository.findById(PredefinedRole.MANAGE_PERMISSION_ROLE).isPresent() ? "already exists" : "created");

            // MANAGE_PRODUCT: READ_PRODUCT, WRITE_PRODUCT, DELETE_PRODUCT
            Set<Permission> manageProductPermissions = new HashSet<>();
            manageProductPermissions.add(permissionRepository.findById("READ_PRODUCT").orElseThrow());
            manageProductPermissions.add(permissionRepository.findById("WRITE_PRODUCT").orElseThrow());
            manageProductPermissions.add(permissionRepository.findById("DELETE_PRODUCT").orElseThrow());

            Role manageProductRole = roleRepository.findByIdWithPermissions(PredefinedRole.MANAGE_PRODUCT_ROLE)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(PredefinedRole.MANAGE_PRODUCT_ROLE)
                                .description("Role for managing products")
                                .permissions(new HashSet<>(manageProductPermissions))
                                .isActive(true)
                                .createAt(Timestamp.valueOf(LocalDateTime.now()))
                                .build();
                        return roleRepository.saveAndFlush(newRole);
                    });
            log.info("Manage Product role {}", roleRepository.findById(PredefinedRole.MANAGE_PRODUCT_ROLE).isPresent() ? "already exists" : "created");

            // MANAGE_PROFILE: READ_PROFILE, WRITE_PROFILE, DELETE_PROFILE
            Set<Permission> manageProfilePermissions = new HashSet<>();
            manageProfilePermissions.add(permissionRepository.findById("READ_PROFILE").orElseThrow());
            manageProfilePermissions.add(permissionRepository.findById("WRITE_PROFILE").orElseThrow());
            manageProfilePermissions.add(permissionRepository.findById("DELETE_PROFILE").orElseThrow());

            Role manageProfileRole = roleRepository.findByIdWithPermissions(PredefinedRole.MANAGE_PROFILE_ROLE)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(PredefinedRole.MANAGE_PROFILE_ROLE)
                                .description("Role for managing profiles")
                                .permissions(new HashSet<>(manageProfilePermissions))
                                .isActive(true)
                                .createAt(Timestamp.valueOf(LocalDateTime.now()))
                                .build();
                        return roleRepository.saveAndFlush(newRole);
                    });
            log.info("Manage Profile role {}", roleRepository.findById(PredefinedRole.MANAGE_PROFILE_ROLE).isPresent() ? "already exists" : "created");

            // MANAGE_ORDER: READ_ORDER, WRITE_ORDER, DELETE_ORDER
            Set<Permission> manageOrderPermissions = new HashSet<>();
            manageOrderPermissions.add(permissionRepository.findById("READ_ORDER").orElseThrow());
            manageOrderPermissions.add(permissionRepository.findById("WRITE_ORDER").orElseThrow());
            manageOrderPermissions.add(permissionRepository.findById("DELETE_ORDER").orElseThrow());

            Role manageOrderRole = roleRepository.findByIdWithPermissions(PredefinedRole.MANAGE_ORDER_ROLE)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(PredefinedRole.MANAGE_ORDER_ROLE)
                                .description("Role for managing orders")
                                .permissions(new HashSet<>(manageOrderPermissions))
                                .isActive(true)
                                .createAt(Timestamp.valueOf(LocalDateTime.now()))
                                .build();
                        return roleRepository.saveAndFlush(newRole);
                    });
            log.info("Manage Order role {}", roleRepository.findById(PredefinedRole.MANAGE_ORDER_ROLE).isPresent() ? "already exists" : "created");

            // Initialize admin user with MODERATOR role
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User user = User.builder()
                        .username("moderator")
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("moderator123"))
                        .roles(Set.of(moderatorRole))
                        .build();
                userRepository.saveAndFlush(user);
                log.info("Admin user created with MODERATOR role.");
            } else {
                log.info("Admin user already exists.");
            }

            // Initialize sample user with USER role
            if (userRepository.findByEmail("user@example.com").isEmpty()) {
                User user = User.builder()
                        .username("user")
                        .email("user@example.com")
                        .password(passwordEncoder.encode("user123"))
                        .roles(Set.of(userRole))
                        .build();
                userRepository.saveAndFlush(user);
                log.info("Sample user created with USER role.");
            } else {
                log.info("Sample user already exists.");
            }

            // Initialize sample user with MANAGE_USER role
            if (userRepository.findByEmail("manageuser@example.com").isEmpty()) {
                User user = User.builder()
                        .username("manageuser")
                        .email("manageuser@example.com")
                        .password(passwordEncoder.encode("manageuser123"))
                        .roles(Set.of(manageUserRole))
                        .build();
                userRepository.saveAndFlush(user);
                log.info("Sample user created with MANAGE_USER role.");
            } else {
                log.info("Sample user with MANAGE_USER role already exists.");
            }

            // Initialize sample user with MANAGE_ROLE role
            if (userRepository.findByEmail("managerole@example.com").isEmpty()) {
                User user = User.builder()
                        .username("managerole")
                        .email("managerole@example.com")
                        .password(passwordEncoder.encode("managerole123"))
                        .roles(Set.of(manageRole))
                        .build();
                userRepository.saveAndFlush(user);
                log.info("Sample user created with MANAGE_ROLE role.");
            } else {
                log.info("Sample user with MANAGE_ROLE role already exists.");
            }

            // Initialize sample user with MANAGE_PERMISSION role
            if (userRepository.findByEmail("managepermission@example.com").isEmpty()) {
                User user = User.builder()
                        .username("managepermission")
                        .email("managepermission@example.com")
                        .password(passwordEncoder.encode("managepermission123"))
                        .roles(Set.of(managePermissionRole))
                        .build();
                userRepository.saveAndFlush(user);
                log.info("Sample user created with MANAGE_PERMISSION role.");
            } else {
                log.info("Sample user with MANAGE_PERMISSION role already exists.");
            }

            // Initialize sample user with MANAGE_PRODUCT role
            if (userRepository.findByEmail("manageproduct@example.com").isEmpty()) {
                User user = User.builder()
                        .username("manageproduct")
                        .email("manageproduct@example.com")
                        .password(passwordEncoder.encode("manageproduct123"))
                        .roles(Set.of(manageProductRole))
                        .build();
                userRepository.saveAndFlush(user);
                log.info("Sample user created with MANAGE_PRODUCT role.");
            } else {
                log.info("Sample user with MANAGE_PRODUCT role already exists.");
            }

            // Initialize sample user with MANAGE_PROFILE role
            if (userRepository.findByEmail("manageprofile@example.com").isEmpty()) {
                User user = User.builder()
                        .username("manageprofile")
                        .email("manageprofile@example.com")
                        .password(passwordEncoder.encode("manageprofile123"))
                        .roles(Set.of(manageProfileRole))
                        .build();
                userRepository.saveAndFlush(user);
                log.info("Sample user created with MANAGE_PROFILE role.");
            } else {
                log.info("Sample user with MANAGE_PROFILE role already exists.");
            }

            // Initialize sample user with MANAGE_ORDER role
            if (userRepository.findByEmail("manageorder@example.com").isEmpty()) {
                User user = User.builder()
                        .username("manageorder")
                        .email("manageorder@example.com")
                        .password(passwordEncoder.encode("manageorder123"))
                        .roles(Set.of(manageOrderRole))
                        .build();
                userRepository.saveAndFlush(user);
                log.info("Sample user created with MANAGE_ORDER role.");
            } else {
                log.info("Sample user with MANAGE_ORDER role already exists.");
            }
        };
    }
}