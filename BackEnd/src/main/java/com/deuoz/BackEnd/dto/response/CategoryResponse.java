package com.deuoz.BackEnd.dto.response;

import com.deuoz.BackEnd.entity.Category;
import com.deuoz.BackEnd.entity.Product;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
// lam HDPE thi ngon luon

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
