package com.example.Identity_Service.mapper;

import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User ToUser(UserCreationRequest user);
    @Mapping(target = "id_user", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest rq);
    UserResponse toUserResponse(User user);
}
