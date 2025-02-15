package com.example.profile_service.controller;

import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/internal")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileInternalController {
    ProfileService profileService;
    @PostMapping()
    public ProfileResponse createProfile(@RequestBody CreationProfileRequest profile){
        return profileService.saveProfile(profile);
    }
}
