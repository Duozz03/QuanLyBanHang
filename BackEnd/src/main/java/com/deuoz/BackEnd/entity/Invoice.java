package com.deuoz.BackEnd.entity;

import com.deuoz.BackEnd.Enum.InvoiceStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, unique = true,length = 64)
    String code;

    LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    InvoiceStatus status = InvoiceStatus.UNPAID;

    double totalAmount = 0;
    double discount = 0;
    double finalAmount = 0;

    @JsonManagedReference
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    List<InvoiceDetail> details = new ArrayList<>();

    @OneToOne(mappedBy = "invoice", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Payment payment;

    LocalDateTime paidAt;
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if(status == null) {
            status = InvoiceStatus.UNPAID;
        }
    }

}
