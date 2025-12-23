package com.deuoz.BackEnd.dto.request.ProductRequest;
import com.deuoz.BackEnd.Enum.Status;
import com.deuoz.BackEnd.entity.Category;
import lombok.*;
import lombok.experimental.FieldDefaults;

// lam HDPE thi ngon luon
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {
    String barcode;
    String name;
    String description;
    double price;
    double importPrice;
    int quantity;
    Status status;
    Long categoryId;
}
