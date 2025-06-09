package org.example.patientservice.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long userId;
    private String email;
    private String phone;
    private String role;
    private String password;
    private String createdAt;
}
