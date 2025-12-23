package com.deuoz.BackEnd.dto.request.CategoryRequest;

import com.deuoz.BackEnd.entity.Category;
import com.deuoz.BackEnd.entity.Product;
import jakarta.validation.constraints.NotBlank;
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
public class CategoryCreationRequest {
    @NotBlank
    String name;
    Long parentId;
}
