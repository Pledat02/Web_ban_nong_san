package com.example.Identity_Service.service;

import com.example.Identity_Service.constant.PredefinedRole;
import com.example.Identity_Service.dto.request.ChangePasswordRequest;
import com.example.Identity_Service.dto.request.CreationProfileRequest;
import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.ReviewerResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.mapper.ProfileClientMapper;
import com.example.Identity_Service.mapper.UserMapper;
import com.example.Identity_Service.repository.ProfileClientHttp;
import com.example.Identity_Service.repository.RoleRepository;
import com.example.Identity_Service.repository.UserRepository;
import com.example.event.dto.NotificationRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    ProfileClientMapper profileClientMapper;
    ProfileClientHttp profileClientHttp;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    KafkaTemplate<String, Object> kafkaTemplate;
    RedisTemplate<String, Object> redisTemplate;

    public UserResponse createUser(UserCreationRequest userrq) {
        if (userRepository.existsByUsername(userrq.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        Optional<User> userOp = userRepository.findByEmail(userrq.getEmail());
        if (userOp.isPresent() && userOp.get().getPassword() != null) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        userrq.setPassword(passwordEncoder.encode(userrq.getPassword()));
        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        User user = userMapper.ToUser(userrq);
        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        // Lưu vào Redis
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
        valueOperations.set("USER_" + savedUser.getId_user(), savedUser);

        CreationProfileRequest profileRq = profileClientMapper.toCreateProfileRequest(userrq);
        profileRq.setId_user(savedUser.getId_user());
        profileClientHttp.createProfile(profileRq);

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .nameReceptor(savedUser.getUsername())
                .emailReceptor(savedUser.getEmail())
                .subject("Thông báo tạo tài khoản thành công")
                .textContent("Chúc mừng bạn đã tạo tài khoản thành công. \n"
                        + "Tên tài khoản: " + savedUser.getUsername() + "\n"
                        + "Ngày tạo: " + LocalDate.now() + ".")
                .build();
        kafkaTemplate.send("user-created", notificationRequest);

        return userMapper.toUserResponse(savedUser);
    }

    @CacheEvict(value = "users", key = "#id_user") // Xóa cache khi cập nhật email
    public void updateEmail(String id_user, String newEmail) {
        User user = userRepository.findById(id_user)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    @Cacheable(value = "users", key = "#id") // Lưu vào cache
    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUserById(String id) {
        log.info("Fetching user from DB...");
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public ReviewerResponse getReviewer(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return ReviewerResponse.builder()
                .id_user(user.getId_user())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .build();
    }

    @CacheEvict(value = "users", key = "#userId") // Xóa cache khi cập nhật avatar
    public UserResponse saveImage(String url, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setAvatar(url);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @CacheEvict(value = "users", key = "#id") // Xóa cache khi xóa user
    public boolean deleteUser(String id) {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            log.error("Error deleting user: " + e.getMessage());
            return false;
        }
    }

    @CacheEvict(value = "users", key = "#idUser") // Xóa cache khi đổi mật khẩu
    public void changePassword(String idUser, ChangePasswordRequest request) {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        PasswordEncoder encoder = new BCryptPasswordEncoder(10);
        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_WRONG);
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserResponse getMyInfor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AppException(ErrorCode.USER_NOT_AUTHENTICATED);
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        User user = userRepository.findById(jwt.getClaim("id_user"))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @CacheEvict(value = "users", key = "#id") // Xóa cache khi cập nhật username
    public UserResponse updateUsername(String id, String username) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        existingUser.setUsername(username);
        return userMapper.toUserResponse(userRepository.save(existingUser));
    }

    @Cacheable(value = "usersList") // Cache danh sách user
//    @PostAuthorize("hasAuthority('GET_DATA')")
    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public PageResponse<UserResponse> searchUsers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> userPage = userRepository.searchUsers(keyword, pageable);

        return new PageResponse<>(page, userPage.getTotalPages(), userPage.getTotalElements(),
                userPage.map(userMapper::toUserResponse).getContent());
    }
}

