package com.deuoz.BackEnd.mapper;

import com.deuoz.BackEnd.dto.response.InvoiceDetailResponse;
import com.deuoz.BackEnd.entity.InvoiceDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvoiceDetailMapper {
    @Mapping(target = "productId", source = "product.id")
    InvoiceDetailResponse toResponse(InvoiceDetail detail);
}
