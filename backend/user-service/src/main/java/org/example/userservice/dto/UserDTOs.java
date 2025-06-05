package org.example.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.userservice.entity.User;
import java.util.List;

import java.sql.Timestamp;

public class UserDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserRequest {
        private String email;

        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(regexp = "^(\\+84|0)\\d{9,10}$", message = "Số điện thoại không hợp lệ")
        private String phone;

        @NotBlank(message = "Mật khẩu không được để trống")
        private String password;

        @NotNull(message = "Vai trò không được để trống")
        private User.Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserUpdateRequest {
        private String phone;
        private String email;
        private String password;
        private User.Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long userId;
        private String email;
        private String phone;
        private User.Role role;
        private Timestamp createdAt;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PagedResponse<T> {
        private List<T> content;
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean last;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
    }
}