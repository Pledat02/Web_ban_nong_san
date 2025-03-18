package com.example.profile_service.mapper;

import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProfileMapper {
    Profile toProfile(CreationProfileRequest profileRequest);
    @Mapping(target = "id_user", ignore = true)
    void updateProfile(@MappingTarget Profile profile, UpdationProfileRequest request);

    ProfileResponse toProfileResponse(Profile user);
}
