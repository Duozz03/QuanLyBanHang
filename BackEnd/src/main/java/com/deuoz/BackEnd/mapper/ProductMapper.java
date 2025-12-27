package com.deuoz.BackEnd.mapper;

import com.deuoz.BackEnd.dto.request.ProductRequest.ProductCreationRequest;
import com.deuoz.BackEnd.dto.request.ProductRequest.ProductUpdateRequest;
import com.deuoz.BackEnd.dto.response.ProductResponse;
import com.deuoz.BackEnd.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.List;
@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductCreationRequest request);
    @Mapping(target = "categoryId", expression = "java(product.getCategory() != null ? product.getCategory().getId() : null)")
    @Mapping(target = "urlImage", expression = "java(product.getUrlImage() == null ? null : (\"/products/\" + product.getId() + \"/image\"))")
    ProductResponse toProductResponse(Product product);
    List<ProductResponse> toResponseList(List<Product> products);
    void updateProduct(@MappingTarget Product product, ProductUpdateRequest request);
    default String buildImageUrl(Long id) {
        return "/products/" + id + "/image";
    }
}
