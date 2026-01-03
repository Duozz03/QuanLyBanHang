package com.deuoz.BackEnd.repository;

import com.deuoz.BackEnd.entity.Product;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface ProductRepository extends JpaRepository<Product,Long> {
    boolean existsByName(String name);
    Optional<Product> findByName(String name);

    boolean existsByBarcode(String barcode);
}
