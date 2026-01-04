package com.deuoz.BackEnd.dto.request.UserRequest;

import com.deuoz.BackEnd.Enum.Role;
import com.deuoz.BackEnd.Enum.Status;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @NotBlank(message = "FULLNAME_REQUIRED")
    @Size(max = 100, message = "FULLNAME_INVALID")
    String fullName;
    String address;
    @Email(message = "EMAIL_INVALID")
    String email;
    @Pattern(
            regexp = "^[0-9]{9,15}$",
            message = "SDT_INVALID"
    )
    String sdt;
    @NotNull(message ="STATUS_REQUIRED")
    Status status;
    @NotNull(message = "ROLE_REQUIRED")
    Role role;
}
