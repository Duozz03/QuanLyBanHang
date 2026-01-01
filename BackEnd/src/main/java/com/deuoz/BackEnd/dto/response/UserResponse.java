package com.deuoz.BackEnd.dto.response;

import com.deuoz.BackEnd.Enum.Role;
import com.deuoz.BackEnd.Enum.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String username;
    String fullName;
    String address;
    String email;
    String sdt;
    LocalDateTime create_at;
    Status status;
    Role role;
}
