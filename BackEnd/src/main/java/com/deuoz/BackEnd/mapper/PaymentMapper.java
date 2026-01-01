package com.deuoz.BackEnd.mapper;

import com.deuoz.BackEnd.dto.request.PaymentRequest.PaymentCreationRequest;
import com.deuoz.BackEnd.dto.response.PaymentResponse;
import com.deuoz.BackEnd.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "invoiceId", source = "invoice.id")
    PaymentResponse toResponse(Payment payment);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    @Mapping(target = "rawCallback", ignore = true)
    Payment toEntity(PaymentCreationRequest request);
}
