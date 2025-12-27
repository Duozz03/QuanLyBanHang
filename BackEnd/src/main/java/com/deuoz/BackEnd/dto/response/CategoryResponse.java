package com.deuoz.BackEnd.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    Long id;
    String name;
    Long parentId;
    long quantity;
    List<ProductResponse> products;
    List<CategoryResponse> children;
}
