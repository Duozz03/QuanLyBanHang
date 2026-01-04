package com.deuoz.BackEnd.dto.response;

import com.deuoz.BackEnd.Enum.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Long id;
    String urlImage;
    String barcode;
    String name;
    String description;
    double price;
    double importPrice;
    int quantity;
    Status status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Long categoryId;
    public ProductResponse withImageUrl(String imageUrl) {
        this.setUrlImage(imageUrl);
        return this;
    }
    Long salePrice;
    LocalDate saleStartAt;
    LocalDate saleEndAt;
    Boolean onSale;
}
