package com.deuoz.BackEnd.controller;

import com.deuoz.BackEnd.dto.request.PaymentRequest.PaymentCreationRequest;
import com.deuoz.BackEnd.dto.request.PaymentRequest.PaymentMarkRequest;
import com.deuoz.BackEnd.dto.response.PaymentResponse;
import com.deuoz.BackEnd.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;
    @PostMapping("/invoice/{invoiceId}")
    public PaymentResponse create(@PathVariable Long invoiceId,
                                  @RequestBody PaymentCreationRequest req) {
        return paymentService.createPayment(invoiceId, req);
    }

    @PostMapping("/{paymentId}/mark")
    public PaymentResponse mark(@PathVariable Long paymentId,
                                @RequestBody PaymentMarkRequest req) {
        return paymentService.markPayment(paymentId, req);
    }

    @GetMapping("/invoice/{invoiceId}")
    public PaymentResponse getByInvoice(@PathVariable Long invoiceId) {
        return paymentService.getByInvoice(invoiceId);
    }
}
