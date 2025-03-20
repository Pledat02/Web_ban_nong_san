package com.example.profile_service.controller;

import com.example.event.dto.ChangeEmailRequest;
import com.example.event.dto.ChangePhoneRequest;
import com.example.profile_service.dto.request.AddressRequest;
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
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    //  Tạo hồ sơ (create profile)
    @PostMapping("address/{idUser}")
    public ApiResponse<Void> createProfile(@RequestBody AddressRequest addressRequest, @PathVariable String idUser) {
        log.debug("Received AddressRequest: {}", addressRequest);
        log.debug("User ID: {}", idUser);

        profileService.saveAddress(addressRequest, idUser);

        return ApiResponse.<Void>builder()
                .message("Cập nhật thông tin địa chỉ thành công")
                .build();
    }
    //  Lấy hồ sơ theo ID
    @GetMapping("/{id}")
    public ApiResponse<ProfileResponse> getProfile(@PathVariable String id) {
        return ApiResponse.<ProfileResponse>builder()
                .data(profileService.getProfileById(id))
                .build();
    }

    // Cập nhật hồ sơ (update profile)
    @PutMapping("/{id}")
    public ApiResponse<Void> updateProfile(@PathVariable String id, @RequestBody UpdationProfileRequest request) {
        log.debug("Received UpdationProfileRequest: {}", request);
        profileService.updateProfile(id, request);
        return ApiResponse.<Void>builder().build();
    }

    // Xóa hồ sơ (delete profile)
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProfile(@PathVariable String id) {
        profileService.deleteProfile(id);
        return ApiResponse.<Void>builder().build();
    }

    // Lấy tất cả hồ sơ với phân trang
    @GetMapping
    public ApiResponse<PageResponse<ProfileResponse>> getAllProfiles(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        return ApiResponse.<PageResponse<ProfileResponse>>builder()
                .data(profileService.getAllProfiles(page, size))
                .build();
    }

    // Tìm kiếm hồ sơ (search profiles)
    @GetMapping("/search")
    public ApiResponse<PageResponse<ProfileResponse>> searchProfiles(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        return ApiResponse.<PageResponse<ProfileResponse>>builder()
                .data(profileService.searchProfiles(keyword, page, size))
                .build();
    }

    // Lấy thông tin hồ sơ của người dùng hiện tại
    @GetMapping("/my-profile")
    public ApiResponse<ProfileResponse> getMyProfile() {
        return ApiResponse.<ProfileResponse>builder()
                .data(profileService.getMyProfile())
                .build();
    }


    // 🔹 Xử lý sự kiện thay đổi email từ Kafka
    @KafkaListener(topics = "change-email", groupId = "notification-group")
    public void changeEmail(ChangeEmailRequest request) {
        try {
            profileService.updateEmail(request.getUserId(), request.getEmail());
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật email cho userId {}: {}", request.getUserId(), e.getMessage(), e);
        }
    }

    // 🔹 Xử lý sự kiện thay đổi số điện thoại từ Kafka
    @KafkaListener(topics = "change-phone", groupId = "notification-group")
    public void changePhone(ChangePhoneRequest request) {
        profileService.updatePhone(request.getUserId(), request.getPhone());
    }
}
