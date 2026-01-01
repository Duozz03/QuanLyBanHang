package com.deuoz.BackEnd.dto.response;

import com.deuoz.BackEnd.Enum.PaymentMethod;
import com.deuoz.BackEnd.Enum.PaymentProvider;
import com.deuoz.BackEnd.Enum.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    private Long id;
    private String code;
    private Long invoiceId;
    private PaymentMethod method;
    private PaymentProvider provider;
    private double amount;
    private PaymentStatus status;
    private String reference;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}
