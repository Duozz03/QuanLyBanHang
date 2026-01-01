package com.deuoz.BackEnd.dto.request.PaymentRequest;

import com.deuoz.BackEnd.Enum.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMarkRequest {
    private PaymentStatus status; // SUCCESS hoặc FAILED
    private String reference;     // optional update
    private String rawCallback;
}
