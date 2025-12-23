package com.deuoz.BackEnd.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
// lam HDPE thi ngon luon

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    String username;
    String password;
}
