package com.deuoz.BackEnd.dto.response;

import com.deuoz.BackEnd.Enum.InvoiceStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceResponse {
    Long id;
    String code;
    LocalDateTime createdAt;
    InvoiceStatus status;
    double totalAmount;
    double discountAmount;
    double finalAmount;
    private List<InvoiceDetailResponse> details;
}
