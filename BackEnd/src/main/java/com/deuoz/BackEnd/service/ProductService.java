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
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
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
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        if (productRepository.existsByBarcode(productRequest.getBarcode())) {
            throw new AppException(ErrorCode.BARCODE_ALREADY_EXISTS);
        }
        var product = productMapper.toProduct(productRequest);
        product.setCategory(category);
        if (productImage != null && !productImage.isEmpty()) {
            try {
                product.setUrlImage(productImage.getBytes());
            } catch (IOException e) {
                throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
            }
        }
        normalizeSale(product);
        validateSale(product.getPrice(), product.getSalePrice(), product.getSaleStartAt(), product.getSaleEndAt());
        Product save = productRepository.save(product);
        categoryRepository.updateQuantity(category.getId(), +1);
        return  productMapper.toProductResponse(save)
                             .withImageUrl("/products/" + product.getId() + "/image");
    }
    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest productRequest,MultipartFile productImage) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        if(!productRequest.getBarcode().equals(product.getBarcode())) {
            if (productRepository.existsByBarcode(productRequest.getBarcode())) {
                throw new AppException(ErrorCode.BARCODE_ALREADY_EXISTS);
            }
        }
        productMapper.updateProduct(product, productRequest);
        if(productRequest.getCategoryId() != null){
            Long categoryOldId = product.getCategory().getId();
            Long categoryNewId = productRequest.getCategoryId();
            if(!categoryOldId.equals(categoryNewId)){
                Category category = categoryRepository.findById(productRequest.getCategoryId())
                        .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
                product.setCategory(category);
                categoryRepository.updateQuantity(categoryOldId, -1);
                categoryRepository.updateQuantity(categoryNewId, +1);
            }
        }
        if (productImage != null && !productImage.isEmpty()) {
            try {
                product.setUrlImage(productImage.getBytes());
            } catch (IOException e) {
                throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
            }
        }
        normalizeSale(product);
        validateSale(product.getPrice(), product.getSalePrice(), product.getSaleStartAt(), product.getSaleEndAt());
        Product savedProduct = productRepository.save(product);

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
                .map(product -> productMapper.toProductResponse(product)
                        .withImageUrl("/products/" + product.getId() + "/image"))
                .toList();
    }
    public Product getProduct(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
    }
    private void validateSale(Double price, Long salePrice, LocalDate start, LocalDate end) {
        if (salePrice == null) return;

        if (salePrice <= 0) throw new AppException(ErrorCode.SALE_PRICE_INVALID);

        if (price != null && salePrice >= price) {
            throw new AppException(ErrorCode.SALE_PRICE_MUST_BE_LESS_THAN_PRICE);
        }

        if (end != null && start.isAfter(end)) {
            throw new AppException(ErrorCode.SALE_DATE_RANGE_INVALID);
        }
    }
    private boolean isOnSale(Product p, LocalDate today) {
        if (p.getSalePrice() == null || p.getSaleStartAt() == null) return false;

        boolean started = !today.isBefore(p.getSaleStartAt());
        boolean notEnded = (p.getSaleEndAt() == null) || !today.isAfter(p.getSaleEndAt());

        return started && notEnded;
    }
    private void normalizeSale(Product p) {
        if (p.getSalePrice() == null) {
            p.setSaleStartAt(null);
            p.setSaleEndAt(null);
            return;
        }
        if (p.getSaleStartAt() == null) {
            p.setSaleStartAt(LocalDate.now());
        }
    }
}
