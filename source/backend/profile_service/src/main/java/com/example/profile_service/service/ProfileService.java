package com.example.profile_service.service;

import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
import com.example.profile_service.dto.response.PageResponse;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.entity.Address;
import com.example.profile_service.entity.Profile;
import com.example.profile_service.exception.AppException;
import com.example.profile_service.exception.ErrorCode;
import com.example.profile_service.mapper.ProfileMapper;
import com.example.profile_service.repository.AddressRepository;
import com.example.profile_service.repository.ProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
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
    AddressRepository addressRepository;

    public ProfileResponse saveProfile(CreationProfileRequest request) {
        Address address;
        if (request.getAddress().getId_address() == null || request.getAddress().getId_address().isEmpty()) {
            // Nếu không có ID, tạo mới Address
            address = Address.builder()
                    .province(request.getAddress().getProvince())
                    .district(request.getAddress().getDistrict())
                    .ward(request.getAddress().getWard())
                    .hamlet(request.getAddress().getHamlet())
                    .postalCode(request.getAddress().getPostalCode())
                    .build();
        } else {
            // Nếu có ID, kiểm tra xem có tồn tại không
            address = addressRepository.findById(request.getAddress().getId_address())
                    .orElseGet(() -> {
                        Address newAddress = Address.builder()
                                .id_address(request.getAddress().getId_address()) // Đảm bảo ID hợp lệ
                                .province(request.getAddress().getProvince())
                                .district(request.getAddress().getDistrict())
                                .ward(request.getAddress().getWard())
                                .hamlet(request.getAddress().getHamlet())
                                .postalCode(request.getAddress().getPostalCode())
                                .build();
                        return addressRepository.save(newAddress);
                    });
        }

        Profile profile = profileMapper.toProfile(request);

        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    public ProfileResponse getProfileById(String userId) {
        return profileMapper.toProfileResponse(profileRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND)));
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
    // change phone
    public void updatePhone(String userId, String phone) {
        Profile profile = profileRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        profile.setPhone(phone);
        profileRepository.save(profile);
    }
    public ProfileResponse getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Profile profile = profileRepository.findById(jwt.getClaim("id_user")).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        return profileMapper.toProfileResponse(profile);
    }
    //change email
    public void updateEmail(String userId, String email) {
        Profile profile = profileRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        profile.setEmail(email);
        profileRepository.save(profile);
    }
    public PageResponse<ProfileResponse> searchProfiles(String keyword, int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Profile> productPage = profileRepository.searchUsers(keyword, pageable);

        List<ProfileResponse> productResponses = productPage.getContent()
                .stream()
                .map(profileMapper::toProfileResponse)
                .toList();

        return PageResponse.<ProfileResponse>builder()
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .elements(productResponses)
                .build();
    }
    public PageResponse<ProfileResponse> getAllProfiles(int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Profile> profilePage = profileRepository.findAll(pageable);

        List<ProfileResponse> profiles = profilePage.getContent()
               .stream()
               .map(profileMapper::toProfileResponse)
               .toList();

        return PageResponse.<ProfileResponse>builder()
               .currentPage(page)
               .totalPages(profilePage.getTotalPages())
               .totalElements(profilePage.getTotalElements())
               .elements(profiles)
               .build();
    }
}