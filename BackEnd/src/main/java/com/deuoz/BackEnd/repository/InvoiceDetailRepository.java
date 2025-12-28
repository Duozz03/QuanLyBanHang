package com.deuoz.BackEnd.repository;

import com.deuoz.BackEnd.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail,Long> {
}
