package com.deuoz.BackEnd.service;

import com.deuoz.BackEnd.dto.request.CategoryRequest.CategoryCreationRequest;
import com.deuoz.BackEnd.dto.request.CategoryRequest.CategoryUpdateRequest;
import com.deuoz.BackEnd.dto.response.CategoryResponse;
import com.deuoz.BackEnd.entity.Category;
import com.deuoz.BackEnd.exception.AppException;
import com.deuoz.BackEnd.exception.ErrorCode;
import com.deuoz.BackEnd.mapper.CategoryMapper;
import com.deuoz.BackEnd.repository.CategoryRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
@Service
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    @Transactional
    public CategoryResponse createCategory(CategoryCreationRequest category_cre) {
        Category category = categoryMapper.toCategory(category_cre);
        if(categoryRepository.existsByName(category_cre.getName())){
            throw new AppException(ErrorCode.NAME_CATEGORY_ALREADY_EXISTS);
        }
        if(category_cre.getParentId() != null){
            Category parent = categoryRepository.findById(category_cre.getParentId()).orElseThrow(() -> new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));

            if(depth(parent) >= 3){
                throw new AppException(ErrorCode.CATEGORY_DEPTH_EXCEEDED);
            }
            category.setParent(parent);
        }
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }
    private int depth(Category category){
        int depth = 1;
        Category current = category;
        while(current.getParent() != null){
            depth++;
            current = current.getParent();
        }
        return depth;
    }
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryUpdateRequest categoryRequest){
        Category category = categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        if(categoryRequest.getParentId() != null){
            Category parent = categoryRepository.findById(categoryRequest.getParentId()).orElseThrow(() -> new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
            if(depth(parent) >= 3){
                throw new AppException(ErrorCode.CATEGORY_DEPTH_EXCEEDED);
            }
            category.setParent(parent);
        }
        categoryMapper.updateCategory(category, categoryRequest);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        if(category.getChildren().isEmpty()){
            categoryRepository.deleteById(id);
        } else {
            throw new AppException(ErrorCode.CATEGORY_HAS_CHILDREN);
        }
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findByParentIsNull().stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    public CategoryResponse getCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        CategoryResponse resp = categoryMapper.toCategoryResponse(category);
        return resp;
    }
}
