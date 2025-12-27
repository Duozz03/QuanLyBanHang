package com.deuoz.BackEnd.dto.request.UserRequest;

import com.deuoz.BackEnd.Enum.Role;
import com.deuoz.BackEnd.Enum.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String password;
    String fullName;
    String address;
    String email;
    Status status;
    Role role;
}
