package com.example.Identity_Service.mapper;

import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.PermissionResponse;
import com.example.Identity_Service.dto.response.RoleResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.Permission;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-19T16:25:55+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User ToUser(UserCreationRequest user) {
        if ( user == null ) {
            return null;
        }

        User.UserBuilder user1 = User.builder();

        user1.email( user.getEmail() );
        user1.username( user.getUsername() );
        user1.password( user.getPassword() );
        user1.avatar( user.getAvatar() );
        Set<Role> set = user.getRoles();
        if ( set != null ) {
            user1.roles( new LinkedHashSet<Role>( set ) );
        }

        return user1.build();
    }

    @Override
    public void updateUser(User user, UserUpdateRequest rq) {
        if ( rq == null ) {
            return;
        }

        user.setEmail( rq.getEmail() );
        user.setUsername( rq.getUsername() );
        user.setPassword( rq.getPassword() );
        user.setAvatar( rq.getAvatar() );
        if ( user.getRoles() != null ) {
            Set<Role> set = rq.getRoles();
            if ( set != null ) {
                user.getRoles().clear();
                user.getRoles().addAll( set );
            }
            else {
                user.setRoles( null );
            }
        }
        else {
            Set<Role> set = rq.getRoles();
            if ( set != null ) {
                user.setRoles( new LinkedHashSet<Role>( set ) );
            }
        }
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.avatar( getAvatarUrl( user.getAvatar() ) );
        userResponse.id_user( user.getId_user() );
        userResponse.username( user.getUsername() );
        userResponse.email( user.getEmail() );
        userResponse.roles( roleSetToRoleResponseSet( user.getRoles() ) );

        return userResponse.build();
    }

    protected PermissionResponse permissionToPermissionResponse(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        PermissionResponse.PermissionResponseBuilder permissionResponse = PermissionResponse.builder();

        permissionResponse.name( permission.getName() );
        permissionResponse.description( permission.getDescription() );

        return permissionResponse.build();
    }

    protected List<PermissionResponse> permissionSetToPermissionResponseList(Set<Permission> set) {
        if ( set == null ) {
            return null;
        }

        List<PermissionResponse> list = new ArrayList<PermissionResponse>( set.size() );
        for ( Permission permission : set ) {
            list.add( permissionToPermissionResponse( permission ) );
        }

        return list;
    }

    protected RoleResponse roleToRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleResponse.RoleResponseBuilder roleResponse = RoleResponse.builder();

        roleResponse.name( role.getName() );
        roleResponse.description( role.getDescription() );
        roleResponse.permissions( permissionSetToPermissionResponseList( role.getPermissions() ) );
        roleResponse.createAt( role.getCreateAt() );

        return roleResponse.build();
    }

    protected Set<RoleResponse> roleSetToRoleResponseSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleResponse> set1 = new LinkedHashSet<RoleResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Role role : set ) {
            set1.add( roleToRoleResponse( role ) );
        }

        return set1;
    }
}
