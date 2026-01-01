package com.deuoz.BackEnd.entity;

import com.deuoz.BackEnd.Enum.PaymentMethod;
import com.deuoz.BackEnd.Enum.PaymentProvider;
import com.deuoz.BackEnd.Enum.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String code;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(length = 16)
    private PaymentProvider provider;
    double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(length = 128)
    private String reference;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String rawCallback;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = PaymentStatus.PENDING;
    }
}
