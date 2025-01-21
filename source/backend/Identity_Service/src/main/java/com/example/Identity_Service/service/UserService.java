package com.example.Identity_Service.service;

import com.example.Identity_Service.dto.Request.UserCreationRequest;
import com.example.Identity_Service.dto.Response.UserResponse;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.mapper.UserMapper;
import com.example.Identity_Service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserService {
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(UserService.class);
    UserRepository userRepository;
     UserMapper userMapper;
     PasswordEncoder passwordEncoder;
    public User createUser(UserCreationRequest userrq) {
        if(userRepository.existsByUsername(userrq.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        userrq.setPassword(passwordEncoder.encode(userrq.getPassword()));
//        HashSet<Role> roles = new HashSet<Role>();
//        roles.add(new Role("User","user role", new HashSet<>()));
        User user = userMapper.ToUser(userrq);
//        user.setRoles(roles);
        return userRepository.save(user);
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
    public UserResponse updateUser(String id, UserCreationRequest user) {


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

}
