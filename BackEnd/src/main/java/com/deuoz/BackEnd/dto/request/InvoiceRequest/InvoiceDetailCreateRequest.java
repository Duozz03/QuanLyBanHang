package com.deuoz.BackEnd.dto.request.InvoiceRequest;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceDetailCreateRequest {
    @NotNull
    private Long productId;
    @Min(1)
    private int quantity;
}
