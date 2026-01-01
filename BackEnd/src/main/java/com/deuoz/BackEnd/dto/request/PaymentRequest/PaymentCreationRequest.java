package com.deuoz.BackEnd.dto.request.PaymentRequest;

import com.deuoz.BackEnd.Enum.PaymentMethod;
import com.deuoz.BackEnd.Enum.PaymentProvider;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCreationRequest {
    private PaymentMethod method;
    private PaymentProvider provider; // chỉ dùng khi method=GATEWAY
    private String reference;         // bank ref hoặc để null
    private double amount;
}
