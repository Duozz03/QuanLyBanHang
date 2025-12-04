package com.deuoz.BackEnd.service;

import com.deuoz.BackEnd.Enum.Role;
import com.deuoz.BackEnd.dto.request.UserRequest.UserCreationRequest;
import com.deuoz.BackEnd.dto.request.UserRequest.UserUpdateRequest;
import com.deuoz.BackEnd.dto.response.UserResponse;
import com.deuoz.BackEnd.entity.User;
import com.deuoz.BackEnd.mapper.UserMapper;
import com.deuoz.BackEnd.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
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
            throw new RuntimeException("Username already exists");
        }
        User newUser = userMapper.toUser(user);
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.toUserResponse(userRepository.save(newUser));
    }
    public UserResponse updateUser(Long id, UserUpdateRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User with id " + id + " not found"));
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
        log.info("In method get user by Id");
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id " + id + " not found")));
    }
    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByUsername(name).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        return userMapper.toUserResponse(user);
    }
}
