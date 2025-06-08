package org.example.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.userservice.entity.User;

import java.time.LocalDate;

public class AuthDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Mật khẩu không được để trống")
        private String password;

        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(regexp = "^(\\+84|0)\\d{9,10}$", message = "Số điện thoại không hợp lệ")
        private String phone;

        @NotBlank(message = "Họ tên không được để trống")
        private String fullName;

        @NotBlank(message = "Số CMND/CCCD không được để trống")
        private String identityNumber;

        @NotBlank(message = "Số bảo hiểm y tế không được để trống")
        private String insuranceNumber;

        @NotNull(message = "Ngày sinh không được để trống")
        private LocalDate birthday;

        @NotNull(message = "Giới tính không được để trống")
        private String gender;

        @NotBlank(message = "Địa chỉ không được để trống")
        private String address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterVerifyRequest {
        @NotBlank(message = "Số điện thoại không được để trống")
        private String phone;

        @NotBlank(message = "Mã OTP không được để trống")
        private String otp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(regexp = "^(\\+84|0)\\d{9,10}$", message = "Số điện thoại không hợp lệ")
        private String phone;

        @NotBlank(message = "Mật khẩu không được để trống")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResetPasswordRequest {
        @NotNull
        private String resetToken;

        @NotBlank(message = "Mật khẩu không được để trống")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResetPasswordResponse {
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long userId;
        private User.Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OtpValidationResponse {
        String resetToken;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterResponse {
        private String message;
    }
}