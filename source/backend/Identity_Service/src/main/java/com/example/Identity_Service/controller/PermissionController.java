package com.example.Identity_Service.controller;

import com.example.Identity_Service.dto.response.ApiResponse;
import com.example.Identity_Service.dto.request.PermissionRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.PermissionResponse;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('MODERATOR')")
public class PermissionController {
    PermissionService permissionService;

    // Get all permissions
    @GetMapping
    @PreAuthorize("hasAuthority('READ_PERMISSION')")
    public ApiResponse<PageResponse<PermissionResponse>> getAllPermissions(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<PermissionResponse>>builder()
                .data(permissionService.getAllPermissions(page, size))
                .build();
    }

    // Search permissions
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('READ_PERMISSION')")
    public ApiResponse<PageResponse<PermissionResponse>> searchPermissions(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<PermissionResponse>>builder()
                .data(permissionService.searchPermissions(q, page, size))
                .build();
    }

    // Get permission by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_PERMISSION')")
    public ApiResponse<PermissionResponse> getPermissionById(@PathVariable String id) {
        PermissionResponse permission = permissionService.getPermission(id);
        if (permission == null) throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        return ApiResponse.<PermissionResponse>builder()
                .data(permission)
                .build();
    }

    // Get permissions by role ID
//    @GetMapping("/role/{roleId}")
//    @PreAuthorize("hasAuthority('READ_PERMISSION')")
//    public ApiResponse<List<PermissionResponse>> getPermissionsByRoleId(@PathVariable String roleId) {
//        List<PermissionResponse> permissions = permissionService.getPermissionsByRoleId(roleId);
//        if (permissions.isEmpty()) throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
//        return ApiResponse.<List<PermissionResponse>>builder()
//                .data(permissions)
//                .build();
//    }

    // Update permission
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_PERMISSION')")
    public ApiResponse<PermissionResponse> updatePermission(
            @PathVariable String id, @RequestBody PermissionRequest requestBody) {
        PermissionResponse permission = permissionService.update(id, requestBody);
        if (permission == null) throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        return ApiResponse.<PermissionResponse>builder()
                .data(permission)
                .build();
    }

    // Create permission
    @PostMapping
    @PreAuthorize("hasAuthority('WRITE_PERMISSION')")
    public ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest requestBody) {
        PermissionResponse permission = permissionService.create(requestBody);
        return ApiResponse.<PermissionResponse>builder()
                .data(permission)
                .build();
    }

    // Delete permission
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_PERMISSION')")
    public ApiResponse<Void> deletePermission(@PathVariable String id) {
        permissionService.deletePermission(id);
        return ApiResponse.<Void>builder()
                .message("Permission deleted")
                .build();
    }
}