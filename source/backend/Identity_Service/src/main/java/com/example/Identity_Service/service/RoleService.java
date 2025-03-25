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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
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
    @CacheEvict(value = "rolesList", allEntries = true)
    @CachePut(value = "roles", key = "#result.name")
    public RoleResponse create(RoleRequest roleRequest) {
        Role role = roleMapper.toRole(roleRequest);
        role.setPermissons(new HashSet<>(permissionRepository.findAllById(roleRequest.getPermissons())));
        Role savedRole = roleRepository.save(role);
        return roleMapper.toRoleResponse(savedRole);
    }

    @CacheEvict(value = {"roles", "rolesList"}, key = "#name", allEntries = true)
    public RoleResponse update(String name, RoleRequest roleRequest) {
        Role role = roleRepository.findById(name).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        roleMapper.updateRole(role, roleRequest);
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toRoleResponse(updatedRole);
    }

    @CacheEvict(value = {"roles", "rolesList"}, key = "#name", allEntries = true)
    public void deleteRole(String name) {
        Role role = roleRepository.findById(name).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        roleRepository.delete(role);
    }

    @Cacheable(value = "roles", key = "#name")
    public RoleResponse getRole(String name){
        Role Role = roleRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        return roleMapper.toRoleResponse(Role);
    }

    @Cacheable(value = "rolesList")
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
        Page<Role> rolePage = roleRepository.searchRoles(keyword, pageable);

        List<RoleResponse> roles= rolePage.getContent()
                .stream().map(roleMapper::toRoleResponse)
                .toList();

        return PageResponse.<RoleResponse>builder()
                .currentPage(page)
                .totalPages(rolePage.getTotalPages())
                .totalElements(rolePage.getTotalElements())
                .elements(roles)
                .build();
    }
}
