package com.deuoz.BackEnd.repository;

import com.deuoz.BackEnd.Enum.InvoiceStatus;
import com.deuoz.BackEnd.entity.Invoice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    @EntityGraph(attributePaths = {"details", "details.product"})
    Optional<Invoice> findById(Long id);

    List<Invoice> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    List<Invoice> findByStatusAndCreatedAtBetweenOrderByCreatedAtDesc(
            InvoiceStatus status,
            LocalDateTime from,
            LocalDateTime to
    );
    Optional<Invoice> findByCode(String code);
}
