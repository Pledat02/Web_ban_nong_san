package com.example.profile_service.controller;

import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
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
    @GetMapping
    public List<ProfileResponse> getAllProfiles() {
        return profileService.getProfiles();
    }
    @PutMapping("/{id}")
    public void updateProfile(@PathVariable String id, @RequestBody UpdationProfileRequest request){
        profileService.updateProfile(id, request);
    }
    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable String id){
        profileService.deleteProfile(id);
    }
}
