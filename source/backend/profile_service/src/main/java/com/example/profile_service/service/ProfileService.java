package com.example.profile_service.service;

import com.example.profile_service.dto.request.AddressRequest;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;
    AddressRepository addressRepository;

    public void saveAddress(AddressRequest request, String idUser) {
            // Nếu có ID, kiểm tra xem có tồn tại không
       Optional<Profile> profileOp = profileRepository.findById(idUser);
        if(profileOp.isPresent()){
            Profile profile = profileOp.get();
            if(profile.getAddress()!=null){
                Address newAddress = Address.builder()
                        .province(request.getProvince())
                        .district(request.getDistrict())
                        .ward(request.getWard())
                        .hamlet(request.getHamlet())
                        .postalCode(request.getPostalCode())
                        .build();
                 addressRepository.save(newAddress);
            }else{
                Address dataAddress = new Address();
                dataAddress.setProvince(request.getProvince());
                dataAddress.setDistrict(request.getDistrict());
                dataAddress.setWard(request.getWard());
                dataAddress.setHamlet(request.getHamlet());
                dataAddress.setPostalCode(request.getPostalCode());
                profile.setAddress(dataAddress);
                profileRepository.save(profile);
            }

        }

    }
    public  ProfileResponse saveProfile(CreationProfileRequest request){
        return profileMapper.toProfileResponse(
                profileRepository.save(profileMapper.toProfile(request)));
    }
    public ProfileResponse getProfileById(String userId) {
        return profileMapper.toProfileResponse(profileRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND)));
    }

    public void updateProfile(String userId, UpdationProfileRequest request) {
        Profile profile = profileRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        log.info(request.toString());
       if(request.getFirstName()!=null){
           profile.setFirstName(request.getFirstName());
       }
       if(request.getLastName()!=null){
           profile.setLastName(request.getLastName());
       }
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