package com.deuoz.BackEnd.repository;

import com.deuoz.BackEnd.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByInvoiceId(Long invoiceId);
    boolean existsByInvoiceId(Long invoiceId);
    Optional<Payment> findByCode(String code);
}
