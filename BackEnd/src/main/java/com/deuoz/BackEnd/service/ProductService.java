package com.deuoz.BackEnd.service;

import com.deuoz.BackEnd.dto.request.ProductCreationRequest;
import com.deuoz.BackEnd.dto.request.ProductUpdateRequest;
import com.deuoz.BackEnd.dto.response.ProductResponse;
import com.deuoz.BackEnd.entity.Product;
import com.deuoz.BackEnd.mapper.ProductMapper;
import com.deuoz.BackEnd.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
@Service
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    public ProductResponse createProduct(ProductCreationRequest productRequest, MultipartFile productImage)
            throws IOException {
        if(productRepository.existsByName((productRequest.getName()))){
            throw new RuntimeException("Product with name " + productRequest.getName() + " already exists");
        }
        var product = productMapper.toProduct(productRequest);
        try {
            product.setUrlImage(productImage.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload product image", e);
        }
        return  productMapper.toProductResponse(productRepository.save(product))
                .withImageUrl("/products/" + product.getId() + "/image");
    }

    public ProductResponse updateProduct(Long id, ProductUpdateRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product with id " + id + " not found"));
        productMapper.updateProduct(product, productRequest);
        return productMapper.toProductResponse(productRepository.save(product));
    }
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toProductResponse)
                .toList();
    }
}
