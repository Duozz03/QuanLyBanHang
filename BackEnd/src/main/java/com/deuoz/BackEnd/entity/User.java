package com.deuoz.BackEnd.entity;

import com.deuoz.BackEnd.Enum.Role;
import com.deuoz.BackEnd.Enum.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String username;
    String password;
    String fullName;
    String address;
    String email;
    Date create_at;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    Status status = Status.ACTIVE;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    Role role = Role.STAFF;
}
