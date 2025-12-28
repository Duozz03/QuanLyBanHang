package com.deuoz.BackEnd.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceDetailResponse {
    Long id;
    Long productId;
    String productName;
    double price;
    double finalPrice;
    int quantity;
    double subTotal;
    double discountAmount;
    double finalSubTotal;
}
