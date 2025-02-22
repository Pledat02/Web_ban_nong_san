package com.example.Identity_Service.service;

import com.example.Identity_Service.dto.request.RoleRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.RoleResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.mapper.RoleMapper;
import com.example.Identity_Service.repository.PermissionRepository;
import com.example.Identity_Service.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
   RoleMapper roleMapper;

    public RoleResponse create (RoleRequest RoleRequest){
        Role Role = roleMapper.toRole(RoleRequest);
        Role.setPermissons(new HashSet<>
                (permissionRepository.findAllById(
                        RoleRequest.getPermissons())));
        Role RoleResponse = roleRepository.save(Role);
        return roleMapper.toRoleResponse(RoleResponse);
    }
    public RoleResponse update (String name, RoleRequest RoleRequest){
        Role Role = roleRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        roleMapper.updateRole(Role,RoleRequest);
        return roleMapper.toRoleResponse(roleRepository.save(Role));
    }
    public RoleResponse getRole(String name){
        Role Role = roleRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        return roleMapper.toRoleResponse(Role);
    }
    public boolean deleteRole(String name){
        Role Role = roleRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        roleRepository.delete(Role);
        return true;
    }
    public List<RoleResponse> getAllRole(){
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }
    public PageResponse<RoleResponse> getReviews(int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Role> rolePage = roleRepository.findAll(pageable);
        List<RoleResponse> roles = rolePage.getContent()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
        return PageResponse.<RoleResponse>builder()
                .currentPage(page)
                .totalPages(rolePage.getTotalPages())
                .totalElements(rolePage.getTotalElements())
                .elements(roles)
                .build();
    }
    public PageResponse<RoleResponse> searchReviews(String keyword, int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Role> reviewPage = roleRepository.searchRoles(keyword, pageable);

        List<RoleResponse> roles= reviewPage.getContent()
                .stream().map(roleMapper::toRoleResponse)
                .toList();

        return PageResponse.<RoleResponse>builder()
                .currentPage(page)
                .totalPages(reviewPage.getTotalPages())
                .totalElements(reviewPage.getTotalElements())
                .elements(roles)
                .build();
    }
}
