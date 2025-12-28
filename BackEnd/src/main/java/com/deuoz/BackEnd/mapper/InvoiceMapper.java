package com.deuoz.BackEnd.mapper;

import com.deuoz.BackEnd.dto.response.InvoiceResponse;
import com.deuoz.BackEnd.entity.Invoice;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring",uses = InvoiceDetailMapper.class)
public interface InvoiceMapper {
    InvoiceResponse toResponse(Invoice invoice);
}
