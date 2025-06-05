package org.example.userservice.service;

import io.jsonwebtoken.Claims;
import org.example.userservice.dto.AuthDTOs;
import org.example.userservice.entity.User;
import org.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthDTOs.UserResponse register(AuthDTOs.RegisterRequest request) {
        // Kiểm tra số điện thoại đã tồn tại chưa
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }

        // Tạo user mới
        User user = new User();
//        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        // Lưu user vào database
        User savedUser = userRepository.save(user);

        // Trả về thông tin user đã đăng ký
        return convertToUserResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthDTOs.LoginResponse login(AuthDTOs.LoginRequest request) {
        // Tìm user theo số điện thoại
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("Số điện thoại hoặc mật khẩu không chính xác"));

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Số điện thoại hoặc mật khẩu không chính xác");
        }

        // Tạo JWT token
        String token = jwtService.generateToken(user);

        // Trả về thông tin đăng nhập
        return new AuthDTOs.LoginResponse(
                token
        );
    }

    private AuthDTOs.UserResponse convertToUserResponse(User user) {
        return new AuthDTOs.UserResponse(
                user.getUserId(),
                user.getRole()
        );
    }

    public AuthDTOs.ResetPasswordResponse resetPassword(AuthDTOs.ResetPasswordRequest request) {
        String token = request.getResetToken();

        // Kiểm tra hạn token
        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Token đã hết hạn hoặc không hợp lệ");
        }

        String subject = jwtService.extractClaim(token, Claims::getSubject);
        if (!"reset-password".equals(subject)) {
            throw new RuntimeException("Token không hợp lệ cho việc đặt lại mật khẩu");
        }

        Long userId = jwtService.extractClaim(token, claims -> claims.get("userId", Long.class));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return new AuthDTOs.ResetPasswordResponse("Đặt lại mật khẩu thành công");
    }



}