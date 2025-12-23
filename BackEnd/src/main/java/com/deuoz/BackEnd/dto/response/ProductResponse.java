package com.deuoz.BackEnd.dto.response;

import com.deuoz.BackEnd.Enum.Status;
import com.deuoz.BackEnd.entity.Category;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;
// lam HDPE thi ngon luon

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
    LocalDate createdAt;
    Long categoryId;
    public ProductResponse withImageUrl(String imageUrl) {
        this.setUrlImage(imageUrl);
        return this;
    }

}
