package com.example.profile_service.service;

import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.entity.Profile;
import com.example.profile_service.mapper.ProfileMapper;
import com.example.profile_service.repository.ProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;

    public ProfileResponse saveProfile(CreationProfileRequest request) {
        Profile profile = profileMapper.toProfile(request);
        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    public ProfileResponse getProfileById(String userId) {
        return profileMapper.toProfileResponse(profileRepository.findById(userId).orElseThrow(() -> new RuntimeException("Profile not found")));
    }

    public void updateProfile(String userId, UpdationProfileRequest request) {
        Profile profile = profileRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("Profile not found"));
        profileMapper.updateProfile(profile, request);
        profileRepository.save(profile);
    }

    public void deleteProfile(String userId) {
        profileRepository.deleteById(userId);
    }
    public List<ProfileResponse> getProfiles() {
        List<ProfileResponse> profiles = new ArrayList<>();
        profileRepository.findAll().forEach(profile -> profiles.add(profileMapper.toProfileResponse(profile)));
        return profiles;
    }
}