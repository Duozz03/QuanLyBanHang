package com.deuoz.BackEnd.service;

import com.deuoz.BackEnd.Enum.InvoiceStatus;
import com.deuoz.BackEnd.dto.request.InvoiceRequest.InvoiceCreateRequest;
import com.deuoz.BackEnd.dto.request.InvoiceRequest.InvoiceDetailCreateRequest;
import com.deuoz.BackEnd.dto.response.InvoiceResponse;
import com.deuoz.BackEnd.entity.Invoice;
import com.deuoz.BackEnd.entity.InvoiceDetail;
import com.deuoz.BackEnd.entity.Product;
import com.deuoz.BackEnd.exception.AppException;
import com.deuoz.BackEnd.exception.ErrorCode;
import com.deuoz.BackEnd.mapper.InvoiceMapper;
import com.deuoz.BackEnd.repository.InvoiceRepository;
import com.deuoz.BackEnd.repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Slf4j
@Service
public class InvoiceService {

    InvoiceRepository invoiceRepository;
    ProductRepository productRepository;
    InvoiceMapper invoiceMapper;
    @Transactional
    public InvoiceResponse createInvoice(InvoiceCreateRequest req) {

        Invoice invoice = new Invoice();
        invoice.setStatus(InvoiceStatus.UNPAID);
        invoice.setPaidAt(null);
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setCode(generateCode());

        double totalAmount = 0;
        double finalAmountBeforeBillDiscount = 0;

        for (InvoiceDetailCreateRequest itemReq : req.getDetails()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

            int qty = itemReq.getQuantity();

            // 1) Check tồn kho
            if (product.getQuantity() == 0 || product.getQuantity() < qty) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }

            // 2) Xác định giá bán (sale nếu hợp lệ)
            double unitPrice = product.getPrice();
            double finalUnitPrice = isOnSale(product, LocalDate.now())
                    ? product.getSalePrice()
                    : unitPrice;

            // 3) Tạo detail (đóng băng giá + tên)
            InvoiceDetail detail = new InvoiceDetail();
            detail.setInvoice(invoice);
            detail.setProduct(product);
            detail.setProductName(product.getName());

            detail.setPrice(unitPrice);
            detail.setFinalPrice(finalUnitPrice);
            detail.setQuantity(qty);

            double subTotal = unitPrice * qty;
            double finalSubTotal = finalUnitPrice * qty;
            double discountAmount = subTotal - finalSubTotal;

            detail.setSubTotal(subTotal);
            detail.setFinalSubTotal(finalSubTotal);
            detail.setDiscountAmount(discountAmount);

            invoice.getDetails().add(detail);

            // 4) Trừ kho
            product.setQuantity(product.getQuantity() - qty);

            // 5) Cộng dồn
            totalAmount += subTotal;
            finalAmountBeforeBillDiscount += finalSubTotal;
        }

        // 6) Giảm giá toàn hóa đơn
        double billDiscount = Math.max(0, req.getDiscount());
        double finalAmount = finalAmountBeforeBillDiscount - billDiscount;

        // không cho âm
        if (finalAmount < 0) finalAmount = 0;

        invoice.setTotalAmount(totalAmount);
        invoice.setDiscount(billDiscount);
        invoice.setFinalAmount(finalAmount);

        return invoiceMapper.toResponse(invoiceRepository.save(invoice));
    }

    private boolean isOnSale(Product p, LocalDate today) {
        if (p.getSalePrice() == null) return false;

        LocalDate start = p.getSaleStartAt();
        LocalDate end = p.getSaleEndAt();

        if (start == null && end == null) return true;                 // sale vô thời hạn
        if (start != null && end == null) return !today.isBefore(start);
        if (start == null) return !today.isAfter(end);                  // end inclusive
        return !today.isBefore(start) && !today.isAfter(end);
    }

    private String generateCode() {
        // đơn giản: HDyyyyMMdd-HHmmss
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        return "HD" + date;
    }
    public List<InvoiceResponse> getInvoices() {
        return invoiceRepository.findAll().stream()
                .map(invoiceMapper::toResponse)
                .toList();
    }
    public InvoiceResponse getInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));
        return invoiceMapper.toResponse(invoice);
    }
}
