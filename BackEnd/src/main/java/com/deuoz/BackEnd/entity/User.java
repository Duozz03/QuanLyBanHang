package com.deuoz.BackEnd.entity;

import com.deuoz.BackEnd.Enum.Role;
import com.deuoz.BackEnd.Enum.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
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
    @Column(nullable = false, unique = true, length = 50)
    String username;
    @Column(nullable = false)
    String password;
    @Column(nullable = false, length = 100)
    String fullName;
    String address;
    @Column(unique = true, length = 100)
    String email;
    @Column(length = 15)
    String sdt;
    LocalDateTime create_at;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    Status status = Status.ACTIVE;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    Role role = Role.STAFF;

    @PrePersist
    protected void onCreate() {
        this.create_at = LocalDateTime.now();
    }
}
