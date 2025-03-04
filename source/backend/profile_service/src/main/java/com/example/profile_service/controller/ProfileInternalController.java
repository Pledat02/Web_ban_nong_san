package com.example.profile_service.controller;

import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.response.ApiResponse;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/internal")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileInternalController {
    ProfileService profileService;
    @PostMapping()
    public ApiResponse<ProfileResponse> createProfile(@RequestBody CreationProfileRequest profile){
        return ApiResponse.<ProfileResponse>builder()
                .data(profileService.saveProfile(profile))
                .build();
    }
   @GetMapping("/${id}")
    public ApiResponse<ProfileResponse> getProfile(@RequestParam String id){
        return ApiResponse.<ProfileResponse>builder()
                .data(profileService.getProfileById(id))
                .build();
    }
}
