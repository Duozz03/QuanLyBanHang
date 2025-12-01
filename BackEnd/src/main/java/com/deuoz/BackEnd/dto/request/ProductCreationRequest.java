package com.deuoz.BackEnd.dto.request;

import com.deuoz.BackEnd.Enum.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

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
    Date createdAt;
    String category;
}
