package com.deuoz.BackEnd.controller;

import com.deuoz.BackEnd.dto.request.InvoiceRequest.InvoiceCreateRequest;
import com.deuoz.BackEnd.dto.response.ApiResponse;
import com.deuoz.BackEnd.dto.response.InvoiceResponse;
import com.deuoz.BackEnd.entity.Invoice;
import com.deuoz.BackEnd.mapper.InvoiceMapper;
import com.deuoz.BackEnd.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
public class InvoiceController {
    final InvoiceService invoiceService;
    final InvoiceMapper invoiceMapper;
    @PostMapping
    public ApiResponse<InvoiceResponse> createInvoice(@Valid @RequestBody InvoiceCreateRequest req) {
        return ApiResponse.<InvoiceResponse>builder()
                .result(invoiceService.createInvoice(req))
                .build();
    }
    @GetMapping
    public ApiResponse<List<InvoiceResponse>> getInvoices() {
        return ApiResponse.<List<InvoiceResponse>>builder()
                .result(invoiceService.getInvoices())
                .build();
    }
    @GetMapping("/{invoiceId}")
    public ApiResponse<InvoiceResponse> getInvoice(@PathVariable("invoiceId") Long invoiceId) {
        return ApiResponse.<InvoiceResponse>builder()
                .result(invoiceService.getInvoice(invoiceId))
                .build();
    }
}
