package com.deuoz.BackEnd.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid request key", HttpStatus.BAD_REQUEST),
    PRODUCT_EXISTED(1002, "Product existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1008, "Category not existed", HttpStatus.NOT_FOUND),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_EXISTED(1005, "Product not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    IMAGE_UPLOAD_FAILED(2001, "Failed to upload product image", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1009, "User not found", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS(1010, "User already exists", HttpStatus.BAD_REQUEST),
    PARENT_CATEGORY_NOT_FOUND(3001, "Parent category not found", HttpStatus.NOT_FOUND),
    CATEGORY_DEPTH_EXCEEDED(3002, "Category depth cannot exceed 3 levels", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_CHILDREN(3003, "Cannot delete category with subcategories", HttpStatus.BAD_REQUEST),
    NAME_CATEGORY_ALREADY_EXISTS(3004, "Category name already exists", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS(1008, "Invalid credentials", HttpStatus.UNAUTHORIZED),
    TOKEN_CREATION_FAILED(1010, "Cannot create token", HttpStatus.INTERNAL_SERVER_ERROR),
    INVOICE_NOT_FOUND(1011, "Invoice not found",HttpStatus.NOT_FOUND ),
    PRODUCT_OUT_OF_STOCK(1012, "product out of stock",HttpStatus.BAD_REQUEST)
    ;

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.status = statusCode;
    }

    private int code;
    private String message;
    private HttpStatus status;
}
