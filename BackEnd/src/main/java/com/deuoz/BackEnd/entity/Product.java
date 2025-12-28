package com.deuoz.BackEnd.entity;

import com.deuoz.BackEnd.Enum.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
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
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    byte[] urlImage;
    String barcode;
    String name;

    @Column(columnDefinition = "TEXT")
    String description;
    double price;
    double importPrice;
    int quantity;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    Status status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id",nullable = false)
    Category category;

    //sale
    private Long salePrice;
    private LocalDate saleStartAt;
    private LocalDate saleEndAt;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    List<InvoiceDetail> orderDetails = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}