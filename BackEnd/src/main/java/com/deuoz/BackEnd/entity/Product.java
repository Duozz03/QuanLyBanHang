package com.deuoz.BackEnd.entity;

import com.deuoz.BackEnd.Enum.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

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
    String description;
    double price;
    double importPrice;
    int quantity;
    Status status;
    LocalDate createdAt;
    String category;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
    }
}
