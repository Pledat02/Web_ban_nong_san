package com.example.profile_service.mapper;

import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toProfile(CreationProfileRequest profileRequest);
    @Mapping(target = "userId", ignore = true)
    void updateProfile(@MappingTarget Profile user, UpdationProfileRequest rq);
    ProfileResponse toProfileResponse(Profile user);
}
