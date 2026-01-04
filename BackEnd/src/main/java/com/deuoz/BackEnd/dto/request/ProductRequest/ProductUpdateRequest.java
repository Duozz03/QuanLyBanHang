package com.deuoz.BackEnd.dto.request.ProductRequest;

import com.deuoz.BackEnd.Enum.Status;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {
    @NotBlank(message = "BARCODE_BLANK")
    String barcode;
    @NotBlank(message = "PRODUCT_NAME_BLANK")
    String name;
    String description;
    @PositiveOrZero(message = "PRICE_INVALID")
    Double price;
    @PositiveOrZero(message = "IMPORT_PRICE_INVALID")
    Double importPrice;
    @Min(value = 0, message = "QUANTITY_INVALID")
    Integer quantity;
    @NotNull(message = "STATUS_REQUIRED")
    Status status;
    @NotNull(message = "CATEGORY_REQUIRED")
    Long categoryId;
    //sale
    Long salePrice;
    LocalDate saleStartAt;
    LocalDate saleEndAt;
}
