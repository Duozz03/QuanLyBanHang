package com.deuoz.BackEnd.controller;

import com.deuoz.BackEnd.dto.request.InvoiceRequest.InvoiceCreateRequest;
import com.deuoz.BackEnd.dto.response.ApiResponse;
import com.deuoz.BackEnd.dto.response.InvoiceResponse;
import com.deuoz.BackEnd.entity.Invoice;
import com.deuoz.BackEnd.mapper.InvoiceMapper;
import com.deuoz.BackEnd.service.InvoiceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
public class InvoiceController {
    InvoiceService invoiceService;
    InvoiceMapper invoiceMapper;
    @PostMapping
    public InvoiceResponse createInvoice(InvoiceCreateRequest req) {
        Invoice invoice = invoiceService.createInvoice(req);
        return invoiceMapper.toResponse(invoice);
    }
}
