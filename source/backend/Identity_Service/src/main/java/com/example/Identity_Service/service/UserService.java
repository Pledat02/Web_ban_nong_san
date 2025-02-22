package com.example.Identity_Service.service;

import com.example.Identity_Service.constant.PredefinedRole;
import com.example.Identity_Service.dto.request.CreationProfileRequest;
import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.event.dto.NotificationRequest;
import com.example.Identity_Service.mapper.ProfileClientMapper;
import com.example.Identity_Service.mapper.UserMapper;
import com.example.Identity_Service.repository.ProfileClientHttp;
import com.example.Identity_Service.repository.RoleRepository;
import com.example.Identity_Service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserService {
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(UserService.class);
    UserRepository userRepository;
     UserMapper userMapper;
     ProfileClientMapper profileClientMapper;
     ProfileClientHttp profileClientHttp;
     PasswordEncoder passwordEncoder;
     RoleRepository roleRepository;
     KafkaTemplate<String,Object> kafkaTemplate;
    public UserResponse createUser(UserCreationRequest userrq) {
        if(userRepository.existsByUsername(userrq.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        userrq.setPassword(passwordEncoder.encode(userrq.getPassword()));
        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        User user = userMapper.ToUser(userrq);
        user.setRoles(roles);
        User userResponse =  userRepository.save(user);
        //save to profile service
        CreationProfileRequest profileRq = profileClientMapper.toCreateProfileRequest(userrq);
        profileRq.setId_user(userResponse.getId_user());
        profileClientHttp.createProfile(profileRq);
        // send kafka
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .nameReceptor(userResponse.getUsername())
                .emailReceptor(userResponse.getEmail())
                .subject("Thông báo tạo tài khoản thành công")
                .textContent("Chúc mừng bạn đã tạo tài khoản thành công. \n"
                        + "Tên tài khoản: " + userResponse.getUsername() + "\n"
                        + "Ngày tạo: " + LocalDate.now() + ".")
                .build();
        kafkaTemplate.send("user-created", notificationRequest);

        return userMapper.toUserResponse(userResponse);
    }
//    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }


    public boolean deleteUser(String id) {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            Logger.getLogger(UserService.class.getName()).severe("Error deleting user: " + e.getMessage());
            return false;
        }
    }
    public UserResponse getMyInfor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }
    public UserResponse updateUser(String id, UserUpdateRequest user) {


        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            Logger.getLogger(UserService.class.getName()).severe("User not found with id: " + id);
            return null;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.updateUser(existingUser,user);
        User userResponse = userRepository.save(existingUser);
        return userMapper.toUserResponse(userResponse);
    }
    @PostAuthorize("hasAuthority('GET_DATA')")
    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }
    public PageResponse<UserResponse> searchProducts(String keyword,int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> userPage = userRepository.searchUsers(keyword, pageable);

        List<UserResponse> userResponses = userPage.getContent()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPages(userPage.getTotalPages())
                .totalElements(userPage.getTotalElements())
                .elements(userResponses)
                .build();
    }

}
