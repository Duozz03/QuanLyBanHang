package com.deuoz.BackEnd.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    @NotBlank(message = "USERNAME_EMPTY")
    String username;
    @NotBlank(message = "PASSWORD_EMPTY")
    String password;
}
