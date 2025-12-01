package com.deuoz.BackEnd.controller;

import com.deuoz.BackEnd.dto.request.ProductCreationRequest;
import com.deuoz.BackEnd.dto.request.ProductUpdateRequest;
import com.deuoz.BackEnd.dto.response.ApiResponse;
import com.deuoz.BackEnd.dto.response.ProductResponse;
import com.deuoz.BackEnd.service.ProductService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
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
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
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
    ApiResponse<ProductResponse> updateProduct(@PathVariable("productId") Long id,@RequestBody ProductUpdateRequest request){
        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProduct(id,request))
                .build();
    }
    @DeleteMapping("/{productId}")
    ApiResponse<String> deleteProduct(@PathVariable("productId") Long id){
        productService.deleteProduct(id);
        return ApiResponse.<String>builder()
                .result("Product with id " + id + " was deleted")
                .build();
    }
}
