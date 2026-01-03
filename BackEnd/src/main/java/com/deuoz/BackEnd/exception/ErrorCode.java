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
    PRODUCT_OUT_OF_STOCK(1012, "product out of stock",HttpStatus.BAD_REQUEST),
    CATEGORY_PARENT_INVALID(1013, "A category cannot be its own parent",HttpStatus.BAD_REQUEST ),
    BARCODE_ALREADY_EXISTS(1014,"Barcode already exists" ,HttpStatus.BAD_REQUEST),

    // ===== SALE VALIDATION =====
    SALE_FIELDS_REQUIRED(1015,"Sale required not null" ,HttpStatus.BAD_REQUEST),
    SALE_PRICE_INVALID(1016,"Price sale must be greater than or equal to 0",HttpStatus.BAD_REQUEST ),
    SALE_PRICE_MUST_BE_LESS_THAN_PRICE(1017,"Price sale must be less than price",HttpStatus.BAD_REQUEST),
    SALE_DATE_RANGE_INVALID(1018, "Date end is invalid", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_PRODUCTS(1019,"Can not delete category has products" ,HttpStatus.BAD_REQUEST),
    // =====VALIDATION =====
    BARCODE_BLANK(2001, "Barcode must not be blank", HttpStatus.BAD_REQUEST),
    PRODUCT_NAME_BLANK(2002, "Product name must not be blank", HttpStatus.BAD_REQUEST),

    PRICE_INVALID(2003, "Price must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    IMPORT_PRICE_INVALID(2004, "Import price must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    QUANTITY_INVALID(2005, "Quantity must be greater than or equal to 0", HttpStatus.BAD_REQUEST),

    STATUS_REQUIRED(1006, "Status is required", HttpStatus.BAD_REQUEST),
    CATEGORY_REQUIRED(1007, "Category is required", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_NOT_BLANK(1008, "Category name must not be blank", HttpStatus.BAD_REQUEST),
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
