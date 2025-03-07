package com.example.Identity_Service.controller;


import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.ApiResponse;
import com.example.Identity_Service.dto.response.ReviewerResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping("/registration")
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreationRequest request){
        return ApiResponse.<UserResponse>builder()
                .data(userService.createUser(request))
                .build();
    }
    @GetMapping("/{id}")
    public  ApiResponse<UserResponse> getUserById(@PathVariable String id){
        UserResponse user =  userService.getUserById(id);
        if(user == null) throw new RuntimeException("User not found");
        return ApiResponse.<UserResponse>builder()
                .data(user)
                .build();
    }
    @GetMapping("/reviewer/{id_user}")
    public ApiResponse<ReviewerResponse> getReviewer(@PathVariable String id_user) {
        ReviewerResponse user =  userService.getReviewer(id_user);
        if(user == null) throw new RuntimeException("Reviewer not found");
        return ApiResponse.<ReviewerResponse>builder()
               .data(user)
               .build();
    }

    @GetMapping("myinfo")
    public  ApiResponse<UserResponse> getUserById(){
        UserResponse user =  userService.getMyInfor();
        if(user == null) throw new RuntimeException("User not found");
        return ApiResponse.<UserResponse>builder()
                .data(user)
                .build();
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id){
        userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable String id, @RequestBody UserUpdateRequest request){
        return userService.updateUser(id, request);
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers(){
        var authentication  = SecurityContextHolder.getContext().getAuthentication();
        log.info("username: "+authentication.getName());
        log.info("authority: "+authentication.getAuthorities());
        ApiResponse<List<UserResponse>> respone = new ApiResponse<List<UserResponse>>();
        respone.setData(userService.getUsers());
        return respone;
    }
}
