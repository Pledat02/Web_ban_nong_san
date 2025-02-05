package com.example.Identity_Service.service;

import com.example.Identity_Service.dto.request.PermissionRequest;
import com.example.Identity_Service.dto.response.PermissionResponse;
import com.example.Identity_Service.entity.Permission;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.mapper.PermissonMapper;
import com.example.Identity_Service.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissonMapper permissionMapper;

    public PermissionResponse create (PermissionRequest permissionRequest){
       Permission permission = permissionRepository.save(permissionMapper.toPermission(permissionRequest));
        return permissionMapper.toPermissionResponse(permission);
    }
    public PermissionResponse update (String name, PermissionRequest permissionRequest){
        Permission permission = permissionRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        permissionMapper.updatePermission(permission,permissionRequest);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }
    public PermissionResponse getPermission(String name){
        Permission permission = permissionRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        return permissionMapper.toPermissionResponse(permission);
    }
    public boolean deletePermission(String name){
        Permission permission = permissionRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        permissionRepository.delete(permission);
        return true;
    }
    public List<PermissionResponse> getAllPermission(){
        return permissionRepository.findAll().stream().map(permissionMapper::toPermissionResponse).toList();
    }
}
