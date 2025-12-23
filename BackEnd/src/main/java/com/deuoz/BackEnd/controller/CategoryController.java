package com.deuoz.BackEnd.controller;

import com.deuoz.BackEnd.dto.request.CategoryRequest.CategoryCreationRequest;
import com.deuoz.BackEnd.dto.request.CategoryRequest.CategoryUpdateRequest;
import com.deuoz.BackEnd.dto.response.ApiResponse;
import com.deuoz.BackEnd.dto.response.CategoryResponse;

import com.deuoz.BackEnd.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// lam HDPE thi ngon luon

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class CategoryController {
    CategoryService categoryService;
    @PostMapping
    ApiResponse<CategoryResponse> create(@Valid @RequestBody CategoryCreationRequest category) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.createCategory(category))
                .build();
    }
    @GetMapping("/{categoryId}")
    ApiResponse<CategoryResponse> getCategory(@PathVariable("categoryId") Long id){
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getCategory(id))
                .build();
    }
    @GetMapping
    ApiResponse<List<CategoryResponse>> getAllCategories(){
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAllCategories())
                .build();
    }

    @DeleteMapping("/{categoryId}")
    ApiResponse<String> deleteCategory(@PathVariable("categoryId") Long id){
        categoryService.deleteCategory(id);
        return ApiResponse.<String>builder()
                .result("Category with id " + id + " was deleted")
                .build();
    }
    @PutMapping("/{categoryId}")
    ApiResponse<CategoryResponse> updateCategory(@PathVariable("categoryId") Long id,@Valid @RequestBody CategoryUpdateRequest update) {
        log.info("this is update category controller");
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(id, update))
                .build();
    }
}
