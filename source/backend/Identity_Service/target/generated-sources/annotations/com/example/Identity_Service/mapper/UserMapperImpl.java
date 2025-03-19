package com.example.Identity_Service.mapper;

import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-19T08:54:02+0700",
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

        user1.id_user( user.getId_user() );
        user1.username( user.getUsername() );
        user1.email( user.getEmail() );
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

        user.setUsername( rq.getUsername() );
        user.setEmail( rq.getEmail() );
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
        Set<Role> set = user.getRoles();
        if ( set != null ) {
            userResponse.roles( new LinkedHashSet<Role>( set ) );
        }

        return userResponse.build();
    }
}
