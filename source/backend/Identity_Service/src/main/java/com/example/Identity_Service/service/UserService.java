package com.example.Identity_Service.service;

import com.example.Identity_Service.constant.PredefinedRole;
import com.example.Identity_Service.dto.request.ChangePasswordRequest;
import com.example.Identity_Service.dto.request.CreationProfileRequest;
import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.ReviewerResponse;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
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
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if(userRepository.findByEmail(userrq.getEmail()).isPresent()){
            throw new AppException(ErrorCode.EMAIL_EXISTED);
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
    public void updateEmail(String id_user, String newEmail){
        User user = userRepository.findById(id_user).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)) ;
        user.setEmail(newEmail);
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }
    public ReviewerResponse getReviewer(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return ReviewerResponse.builder()
                .id_user(user.getId_user())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .build();
    }
    //save image
    public UserResponse saveImage(String url,String userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setAvatar(url);
       return  userMapper.toUserResponse(userRepository.save(user));
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
    public void changePassword(String idUser,ChangePasswordRequest request){
        User user = userRepository.findById(idUser).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)) ;

        if(user == null){
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        if(!passwordEncoder.matches(request.getOldPassword(),user.getPassword())){
            throw new AppException(ErrorCode.PASSWORD_WRONG);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    public UserResponse getMyInfor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AppException(ErrorCode.USER_NOT_AUTHENTICATED);
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        User user = userRepository.findById(jwt.getClaim("id_user")).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }
    public UserResponse updateUsername(String id,String username) {


        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return null;
        }
        existingUser.setUsername(username);
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
