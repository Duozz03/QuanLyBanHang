package com.deuoz.BackEnd.dto.request.CategoryRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryUpdateRequest {
    @NotBlank(message = "CATEGORY_NAME_NOT_BLANK")
    String name;
    Long parentId;
}
