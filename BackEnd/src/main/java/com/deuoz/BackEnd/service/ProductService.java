package com.deuoz.BackEnd.service;

import com.deuoz.BackEnd.dto.request.ProductRequest.ProductCreationRequest;
import com.deuoz.BackEnd.dto.request.ProductRequest.ProductUpdateRequest;
import com.deuoz.BackEnd.dto.response.ProductResponse;
import com.deuoz.BackEnd.entity.Category;
import com.deuoz.BackEnd.entity.Product;
import com.deuoz.BackEnd.exception.AppException;
import com.deuoz.BackEnd.exception.ErrorCode;
import com.deuoz.BackEnd.mapper.ProductMapper;
import com.deuoz.BackEnd.repository.CategoryRepository;
import com.deuoz.BackEnd.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
@Service
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    CategoryRepository categoryRepository;
    @Transactional
    public ProductResponse createProduct(ProductCreationRequest productRequest, MultipartFile productImage)
            throws IOException {
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + productRequest.getCategoryId()));
        var product = productMapper.toProduct(productRequest);
        product.setCategory(category);
        try {
            product.setUrlImage(productImage.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload product image", e);
        }
        Product save = productRepository.save(product);
        categoryRepository.updateQuantity(category.getId(), +1);
        return  productMapper.toProductResponse(save)
                             .withImageUrl("/products/" + product.getId() + "/image");
    }
    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest productRequest,MultipartFile productImage)
            throws IOException {
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        Long categoryOldId = product.getCategory().getId();
        product.setCategory(category);
        Long categoryNewId = product.getCategory().getId();
        productMapper.updateProduct(product, productRequest);
        try {
            if(productImage!=null && !productImage.isEmpty()){
                product.setUrlImage(productImage.getBytes());
            }
        } catch (IOException e) {
            throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
        Product savedProduct = productRepository.save(product);
        categoryRepository.updateQuantity(categoryOldId, -1);
        categoryRepository.updateQuantity(categoryNewId, +1);

        return productMapper.toProductResponse(savedProduct)
                            .withImageUrl("/products/" + product.getId() + "/image");
    }
    @Transactional
    public void deleteProduct(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        Long categoryId = p.getCategory().getId();
        productRepository.deleteById(id);
        categoryRepository.updateQuantity(categoryId, -1);
    }
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> {
                    ProductResponse resp = productMapper.toProductResponse(product);
                    if (product.getUrlImage() != null) {
                        String base64 = Base64.getEncoder().encodeToString(product.getUrlImage());
                        resp.setUrlImage("/products/" + product.getId() + "/image");
                    }
                    return resp;
                })

                .toList();
    }
    public Product getProduct(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
    }
}
