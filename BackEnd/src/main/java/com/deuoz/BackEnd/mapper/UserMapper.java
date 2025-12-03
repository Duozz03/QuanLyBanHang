package com.deuoz.BackEnd.mapper;

import com.deuoz.BackEnd.dto.request.UserRequest.UserCreationRequest;
import com.deuoz.BackEnd.dto.request.UserRequest.UserUpdateRequest;
import com.deuoz.BackEnd.dto.response.UserResponse;
import com.deuoz.BackEnd.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
    void  updateUser(@MappingTarget User user, UserUpdateRequest request);
}
