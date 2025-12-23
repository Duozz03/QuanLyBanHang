package com.deuoz.BackEnd.mapper;

import com.deuoz.BackEnd.dto.request.CategoryRequest.CategoryCreationRequest;
import com.deuoz.BackEnd.dto.request.CategoryRequest.CategoryUpdateRequest;
import com.deuoz.BackEnd.dto.response.CategoryResponse;
import com.deuoz.BackEnd.entity.Category;
import org.hibernate.boot.internal.Target;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
// lam HDPE thi ngon luon
@Mapper(componentModel = "spring",uses = ProductMapper.class)
public interface CategoryMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    Category toCategory(CategoryCreationRequest request);
    @Mapping(target = "parentId", expression = "java(category.getParent() != null ? category.getParent().getId() : null)")
    @Mapping(target = "children", source = "children")
    @Mapping(target = "products", source = "products")
    CategoryResponse toCategoryResponse(Category category);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);
    List<CategoryResponse> toCategoryResponseList(List<Category> categoryList);
}
