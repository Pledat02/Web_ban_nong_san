package com.example.profile_service.controller;

import com.example.event.dto.ChangeEmailRequest;
import com.example.event.dto.ChangePhoneRequest;
import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
import com.example.profile_service.dto.response.ApiResponse;
import com.example.profile_service.dto.response.PageResponse;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @PostMapping
    public ProfileResponse createProfile(@RequestBody CreationProfileRequest profile){
        return profileService.saveProfile(profile);
    }
    @GetMapping("/{id}")
    ProfileResponse getProfile(@PathVariable String id){
        return profileService.getProfileById(id);
    }

    @PutMapping("/{id}")
    public void updateProfile(@PathVariable String id, @RequestBody UpdationProfileRequest request){
        profileService.updateProfile(id, request);
    }
    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable String id){
        profileService.deleteProfile(id);
    }
    @GetMapping
    public ApiResponse<PageResponse<ProfileResponse>> getAllProfiles(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ){
        return ApiResponse.<PageResponse<ProfileResponse>> builder()
                .data(profileService.getAllProfiles(page, size))
               .build();

    }
    @GetMapping("/search")
    public ApiResponse<PageResponse<ProfileResponse>> searchProfiles(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ){
        return ApiResponse.<PageResponse<ProfileResponse>> builder()
               .data(profileService.searchProfiles(keyword, page, size))
               .build();
    }
    // change email
    @KafkaListener(topics = "change-email", groupId = "notification-group")
    public void changeEmail(ChangeEmailRequest request) {
        try {
            log.info("Nhận yêu cầu thay đổi email cho userId: {}", request.getUserId());
            profileService.updateEmail(request.getUserId(), request.getEmail());
            log.info("Cập nhật email thành công: {}", request.getEmail());
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật email cho userId {}: {}", request.getUserId(), e.getMessage(), e);
        }
    }
    // change phone
    @KafkaListener(topics = "change-phone", groupId = "notification-group")
    public void changePhone(ChangePhoneRequest changePhoneRequest){
        profileService.updatePhone(changePhoneRequest.getUserId()
                , changePhoneRequest.getPhone());
    }
}
