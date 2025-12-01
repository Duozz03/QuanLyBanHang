package com.deuoz.BackEnd.mapper;

import com.deuoz.BackEnd.dto.request.ProductCreationRequest;
import com.deuoz.BackEnd.dto.request.ProductUpdateRequest;
import com.deuoz.BackEnd.dto.response.ProductResponse;
import com.deuoz.BackEnd.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductCreationRequest request);
    @Mapping(target = "urlImage", ignore = true)
    ProductResponse toProductResponse(Product product);
    void updateProduct(@MappingTarget Product product, ProductUpdateRequest request);
}
