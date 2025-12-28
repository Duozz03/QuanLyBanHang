package com.deuoz.BackEnd.dto.request.InvoiceRequest;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceDetailCreateRequest {
    private Long id;

    private Long productId;
    private String productName;

    private double price;       // giá thường tại thời điểm bán (entity: price)
    private double finalPrice;  // giá sau sale tại thời điểm bán (entity: finalPrice)
    private int quantity;

    private double subTotal;
    private double discountAmount;
    private double finalSubTotal;
}
