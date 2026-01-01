package com.deuoz.BackEnd.service;

import com.deuoz.BackEnd.dto.request.UserRequest.UserCreationRequest;
import com.deuoz.BackEnd.dto.request.UserRequest.UserUpdateRequest;
import com.deuoz.BackEnd.dto.response.UserResponse;
import com.deuoz.BackEnd.entity.User;
import com.deuoz.BackEnd.exception.AppException;
import com.deuoz.BackEnd.exception.ErrorCode;
import com.deuoz.BackEnd.mapper.UserMapper;
import com.deuoz.BackEnd.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j

public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    public UserResponse create(UserCreationRequest user){
        if(userRepository.existsByUsername(user.getUsername())){
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }
        User newUser = userMapper.toUser(user);
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.toUserResponse(userRepository.save(newUser));
    }
    public UserResponse updateUser(Long id, UserUpdateRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(user,request);
        return userMapper.toUserResponse(userRepository.save(user));
    }
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }
    public List<UserResponse> findAll(){
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }
    public UserResponse getUser(Long id){
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }
    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByUsername(name).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
        return userMapper.toUserResponse(user);
    }
    public List<UserResponse> getAllUser(){
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }
    public void delete(Long id){
        userRepository.deleteById(id);
    }
}
