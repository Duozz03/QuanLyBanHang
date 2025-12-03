package com.deuoz.BackEnd.controller;

import com.deuoz.BackEnd.dto.request.ProductRequest.ProductCreationRequest;
import com.deuoz.BackEnd.dto.request.ProductRequest.ProductUpdateRequest;
import com.deuoz.BackEnd.dto.response.ApiResponse;
import com.deuoz.BackEnd.dto.response.ProductResponse;
import com.deuoz.BackEnd.entity.Product;
import com.deuoz.BackEnd.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
public class ProductController {
    private final ProductService productService;
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<ProductResponse> addProduct(@RequestPart("product") ProductCreationRequest product,
                                            @RequestPart("image") MultipartFile image) throws Exception{
        return ApiResponse.<ProductResponse>builder()
                .result(productService.createProduct(product,image))
                .build();
    }
    @GetMapping
    ApiResponse<List<ProductResponse>> getAllProducts(){
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getAllProducts())
                .build();
    }
    @PutMapping("/{productId}")
    ApiResponse<ProductResponse> updateProduct(
            @PathVariable("productId") Long id,@RequestPart("product") ProductUpdateRequest request,
            @RequestPart("image") MultipartFile image) throws Exception{
        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProduct(id,request,image))
                .build();
    }
    @DeleteMapping("/{productId}")
    ApiResponse<String> deleteProduct(@PathVariable("productId") Long id){
        productService.deleteProduct(id);
        return ApiResponse.<String>builder()
                .result("Product with id " + id + " was deleted")
                .build();
    }
    //Endpoint to load ảnh
    @GetMapping("/{id}/image")
    public ApiResponse<byte[]> getProductImage(@PathVariable Long id) {
        Product product = productService.getProduct(id);
        byte[] imageData = product.getUrlImage();

        return ApiResponse.<byte[]>builder()
                .result(imageData)
                .build();

    }
}
