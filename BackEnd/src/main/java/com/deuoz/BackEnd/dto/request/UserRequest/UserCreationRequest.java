package com.deuoz.BackEnd.dto.request.UserRequest;

import com.deuoz.BackEnd.Enum.Role;
import com.deuoz.BackEnd.Enum.Status;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @NotBlank(message = "USERNAME_EMPTY")
    @Size(min = 4, max = 20, message = "USERNAME_INVALID")
    String username;
    @NotBlank(message = "PASSWORD_EMPTY")
    @Size(min = 6, max = 20, message = "PASSWORD_INVALID")
    String password;
    @NotBlank(message = "FULLNAME_REQUIRED")
    @Size(max = 100, message = "FULLNAME_INVALID")
    String fullName;
    String address;
    @Pattern(
            regexp = "^[0-9]{9,15}$",
            message = "SDT_INVALID"
    )
    String sdt;
    @Email(message = "EMAIL_INVALID")
    String email;
    @NotNull(message ="STATUS_REQUIRED")
    Status status;
    @NotNull(message = "ROLE_REQUIRED")
    Role role;
}
