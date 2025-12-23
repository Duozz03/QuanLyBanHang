package com.deuoz.BackEnd.service;

import com.deuoz.BackEnd.dto.request.CategoryRequest.CategoryCreationRequest;
import com.deuoz.BackEnd.dto.request.CategoryRequest.CategoryUpdateRequest;
import com.deuoz.BackEnd.dto.response.CategoryResponse;
import com.deuoz.BackEnd.entity.Category;
import com.deuoz.BackEnd.mapper.CategoryMapper;
import com.deuoz.BackEnd.repository.CategoryRepository;
import jakarta.transaction.Transactional;
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
            throw new RuntimeException("Name category already exists");
        }
        if(category_cre.getParentId() != null){
            Category parent = categoryRepository.findById(category_cre.getParentId()).orElseThrow(() -> new RuntimeException("Parent category not found with id: " + category_cre.getParentId()));
            if(depth(parent) >= 3){
                throw new RuntimeException("Category depth cannot exceed 3 levels");
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
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        if(categoryRequest.getParentId() != null){
            Category parent = categoryRepository.findById(categoryRequest.getParentId()).orElseThrow(() -> new RuntimeException("Parent category not found with id: " + categoryRequest.getParentId()));
            if(depth(parent) >= 3){
                throw new RuntimeException("Category depth cannot exceed 3 levels");
            }
            category.setParent(parent);
        }
        categoryMapper.updateCategory(category, categoryRequest);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        if(category.getChildren().isEmpty()){
            categoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("Cannot delete category with subcategories");
        }
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    public CategoryResponse getCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        CategoryResponse resp = categoryMapper.toCategoryResponse(category);

        fillProductImageUrlRecursive(resp);

        return resp;
    }

    private void fillProductImageUrlRecursive(CategoryResponse node) {
        if (node == null) return;

        if (node.getProducts() != null) {
            node.getProducts().forEach(p -> {
                if (p.getId() != null) {
                    p.setUrlImage("/products/" + p.getId() + "/image");
                }
            });
        }

        if (node.getChildren() != null) {
            node.getChildren().forEach(this::fillProductImageUrlRecursive);
        }
    }
}
