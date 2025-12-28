package com.deuoz.BackEnd.dto.request.InvoiceRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceCreateRequest {
    @Valid
    @NotEmpty
    private List<InvoiceDetailCreateRequest> details;
    @Min(0)
    private double discount = 0;
}
