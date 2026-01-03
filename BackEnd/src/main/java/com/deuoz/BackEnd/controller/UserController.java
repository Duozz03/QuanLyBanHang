package com.deuoz.BackEnd.controller;

import com.deuoz.BackEnd.dto.request.UserRequest.UserCreationRequest;
import com.deuoz.BackEnd.dto.request.UserRequest.UserUpdateRequest;
import com.deuoz.BackEnd.dto.response.ApiResponse;
import com.deuoz.BackEnd.dto.response.UserResponse;
import com.deuoz.BackEnd.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UserController {
    final UserService userService;
    @PostMapping
    ApiResponse<UserResponse>create(@RequestBody UserCreationRequest request){
        return ApiResponse.<UserResponse>builder()
                .result(userService.create(request))
                .build();
    }
    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable("userId") Long userId,
                                         @RequestBody UserUpdateRequest request){
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId,request))
                .build();
    }
    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") Long userId){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }
    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }
    @GetMapping
    ApiResponse<List<UserResponse>> getAllUser(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUser())
                .build();
    }
    @DeleteMapping("/{userId}")
    ApiResponse<Void> deleteUser(@PathVariable("userId") Long userId){
        userService.deleteUser(userId);
        return ApiResponse.<Void>builder()
                .build();
    }
}
