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
    final CategoryRepository categoryRepository;
    final CategoryMapper categoryMapper;
    @Transactional
    public CategoryResponse createCategory(CategoryCreationRequest category_cre) {
        String name = category_cre.getName().trim();
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.NAME_CATEGORY_ALREADY_EXISTS);
        }
        Category category = categoryMapper.toCategory(category_cre);
        category.setName(name);
        log.info("Parent category set with ID: {}", category_cre.getParentId());
        if(category_cre.getParentId() != null) {
            Category parent = categoryRepository.findById(category_cre.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
            if(depth(parent) >= 3){
                throw new AppException(ErrorCode.CATEGORY_DEPTH_EXCEEDED);
            }
            category.setParent(parent);
        }
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }
    public int maxDepthFromRoot(Category root) {
        if (root == null) return 0;
        return dfsDepth(root, 1);
    }

    private int dfsDepth(Category node, int depth) {
        int best = depth;
        if (node.getChildren() != null) {
            for (Category child : node.getChildren()) {
                best = Math.max(best, dfsDepth(child, depth + 1));
            }
        }
        return best;
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
        String name = categoryRequest.getName().trim();
        if(categoryRepository.existsByNameIgnoreCaseAndIdNot(name,id)){
            throw new AppException(ErrorCode.NAME_CATEGORY_ALREADY_EXISTS);
        }
        category.setName(name);
        if(categoryRequest.getParentId() == null){
            category.setParent(null);
        }else{
            if(categoryRequest.getParentId().equals(id)){
                throw new AppException(ErrorCode.CATEGORY_PARENT_INVALID);
            }
            Category parent = categoryRepository.findById(categoryRequest.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
            assertNoCycle(category, parent);
            if(depth(parent) >= 3 || (maxDepthFromRoot(category)+depth(parent)) > 3) {
                throw new AppException(ErrorCode.CATEGORY_DEPTH_EXCEEDED);
            }
            category.setParent(parent);
        }
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        if(!category.getChildren().isEmpty()){
            throw new AppException(ErrorCode.CATEGORY_HAS_CHILDREN);
        }
        if(category.getProducts().isEmpty()) {
            categoryRepository.delete(category);
        }
        else {
            throw new AppException(ErrorCode.CATEGORY_HAS_PRODUCTS);
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
    private void assertNoCycle(Category category, Category newParent) {
        Category cur = newParent;
        while (cur != null) {
            if (cur.getId().equals(category.getId())) {
                throw new AppException(ErrorCode.CATEGORY_PARENT_INVALID);
            }
            cur = cur.getParent();
        }
    }
}
