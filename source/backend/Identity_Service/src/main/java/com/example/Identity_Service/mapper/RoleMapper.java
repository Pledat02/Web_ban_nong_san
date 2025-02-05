package com.example.Identity_Service.mapper;

import com.example.Identity_Service.dto.request.RoleRequest;
import com.example.Identity_Service.dto.response.RoleResponse;
import com.example.Identity_Service.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissons", ignore = true)
    Role toRole(RoleRequest RoleRequest);
    RoleResponse toRoleResponse(Role Role);
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "permissons", ignore = true)
    void updateRole(@MappingTarget Role Role, RoleRequest RoleRequest);
}
