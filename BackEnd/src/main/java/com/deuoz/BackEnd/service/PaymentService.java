package com.deuoz.BackEnd.service;

import com.deuoz.BackEnd.Enum.InvoiceStatus;
import com.deuoz.BackEnd.Enum.PaymentMethod;
import com.deuoz.BackEnd.Enum.PaymentProvider;
import com.deuoz.BackEnd.Enum.PaymentStatus;
import com.deuoz.BackEnd.dto.request.PaymentRequest.PaymentCreationRequest;
import com.deuoz.BackEnd.dto.request.PaymentRequest.PaymentMarkRequest;
import com.deuoz.BackEnd.dto.response.PaymentResponse;
import com.deuoz.BackEnd.entity.Invoice;
import com.deuoz.BackEnd.entity.Payment;
import com.deuoz.BackEnd.mapper.PaymentMapper;
import com.deuoz.BackEnd.repository.InvoiceRepository;
import com.deuoz.BackEnd.repository.PaymentRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
@Service
public class PaymentService {

    final PaymentRepository paymentRepository;
    final InvoiceRepository invoiceRepository;
    final PaymentMapper paymentMapper;


    @Transactional
    public PaymentResponse createPayment(Long invoiceId, PaymentCreationRequest req) {

        if (req == null || req.getMethod() == null) {
            throw new RuntimeException("Payment method is required");
        }

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found: " + invoiceId));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new RuntimeException("Invoice already PAID");
        }

        if (paymentRepository.existsByInvoiceId(invoiceId)) {
            throw new RuntimeException("Payment already exists for this invoice");
        }

        validateMethodProvider(req.getMethod(), req.getProvider());

        Payment payment = paymentMapper.toEntity(req);
        payment.setInvoice(invoice);
        payment.setCode(generatePaymentCode());

        // ===== AMOUNT (double) =====
        double amount = req.getAmount();

        // nếu client không gửi hoặc gửi <= 0 → lấy invoice.finalAmount
        if (amount <= 0) {
            amount = invoice.getFinalAmount();
        }

        if (amount <= 0) {
            throw new RuntimeException("Invalid payment amount");
        }

        payment.setAmount(amount);

        // ===== CASH / BANK_TRANSFER =====
        if (req.getMethod() == PaymentMethod.CASH ||
                req.getMethod() == PaymentMethod.BANK_TRANSFER) {

            markPaid(payment, invoice);

        } else {
            // ===== GATEWAY =====
            payment.setStatus(PaymentStatus.PENDING);
            payment.setPaidAt(null);
        }

        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponse markPayment(Long paymentId, PaymentMarkRequest req) {

        if (req == null || req.getStatus() == null) {
            throw new RuntimeException("Status is required");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        if (payment.getMethod() != PaymentMethod.GATEWAY) {
            throw new RuntimeException("Only GATEWAY payment can be marked");
        }

        Invoice invoice = payment.getInvoice();

        if (req.getReference() != null && !req.getReference().isBlank()) {
            payment.setReference(req.getReference());
        }

        if (req.getStatus() == PaymentStatus.SUCCESS) {
            markPaid(payment, invoice);
        }

        if (req.getStatus() == PaymentStatus.FAILED) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setPaidAt(null);

            invoice.setStatus(InvoiceStatus.UNPAID);
            invoice.setPaidAt(null);
            invoiceRepository.save(invoice);
        }

        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public PaymentResponse getByInvoice(Long invoiceId) {
        Payment payment = paymentRepository.findByInvoiceId(invoiceId)
                .orElseThrow(() -> new RuntimeException("Payment not found for invoice: " + invoiceId));
        return paymentMapper.toResponse(payment);
    }

    // ================= PRIVATE =================

    private void validateMethodProvider(PaymentMethod method, PaymentProvider provider) {
        if (method == PaymentMethod.GATEWAY && provider == null) {
            throw new RuntimeException("Provider is required for GATEWAY");
        }
        if (method != PaymentMethod.GATEWAY && provider != null) {
            throw new RuntimeException("Provider must be null unless method=GATEWAY");
        }
    }

    private void markPaid(Payment payment, Invoice invoice) {
        LocalDateTime now = LocalDateTime.now();

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(now);

        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(now);

        invoiceRepository.save(invoice);
    }

    private String generatePaymentCode() {
        return "PAY-" + System.currentTimeMillis();
    }
}
