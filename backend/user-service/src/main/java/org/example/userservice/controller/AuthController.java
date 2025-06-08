package org.example.userservice.controller;

import jakarta.validation.Valid;
import org.example.userservice.dto.AuthDTOs;
import org.example.userservice.dto.UserDTOs;
import org.example.userservice.service.OtpService;
import org.example.userservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/auth")
public class AuthController {

    private final AuthService userService;
    private final OtpService otpService;

    @Autowired
    public AuthController(AuthService userService, OtpService otpService) {
        this.userService = userService;
        this.otpService = otpService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDTOs.RegisterResponse> register(@Valid @RequestBody AuthDTOs.RegisterRequest request) {
        System.out.println("Nhận request đăng ký với số điện thoại: " + request.getPhone());
        System.out.println("Thông tin đăng ký: " + request);
        // Lưu thông tin đăng ký tạm thời và gửi OTP
        userService.preRegister(request);
        String phone = request.getPhone();
        if (phone.startsWith("0")) {
            phone = "84" + phone.substring(1);
        }
        otpService.sendOtp(phone);
        System.out.println("Đã gửi OTP và lưu thông tin đăng ký tạm thời");
        return ResponseEntity.ok(new AuthDTOs.RegisterResponse("Mã OTP đã được gửi đến số điện thoại của bạn"));
    }

    @PostMapping("/register/verify")
    public ResponseEntity<AuthDTOs.UserResponse> verifyRegistration(@Valid @RequestBody AuthDTOs.RegisterVerifyRequest request) {
        System.out.println("Nhận request xác thực OTP với số điện thoại: " + request.getPhone());
        AuthDTOs.UserResponse response = userService.completeRegistration(request);
        System.out.println("Hoàn tất đăng ký cho user: " + response);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTOs.LoginResponse> login(@Valid @RequestBody AuthDTOs.LoginRequest request) {
        AuthDTOs.LoginResponse response = userService.login(request);
        System.out.println("Login");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/reset-password")
    public ResponseEntity<AuthDTOs.ResetPasswordResponse> resetPassword(@Valid @RequestBody AuthDTOs.ResetPasswordRequest request) {
        AuthDTOs.ResetPasswordResponse response = userService.resetPassword(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/otp/send-sms")
    public ResponseEntity<String> sendOtp(@RequestParam String phoneNumber) {
        otpService.sendOtp(phoneNumber);
        return ResponseEntity.ok("Đã gửi OTP tới " + phoneNumber);
    }

    @PostMapping("/otp/validate-sms")
    public ResponseEntity<AuthDTOs.OtpValidationResponse> validateOtp(@RequestParam String phoneNumber, @RequestParam String otp) {
        return ResponseEntity.ok(otpService.validateOtp(phoneNumber, otp));
    }

    @PostMapping("/otp/send-email")
    public ResponseEntity<String> sendOtpByEmail(@RequestParam String email) {
        otpService.sendOtpToEmail(email);
        return ResponseEntity.ok("OTP đã được gửi tới email");
    }

    @PostMapping("/otp/validate-email")
    public ResponseEntity<AuthDTOs.OtpValidationResponse> validateEmailOtp(
            @RequestParam String email,
            @RequestParam String otp
    ) {
        AuthDTOs.OtpValidationResponse response = otpService.validateOtpByEmail(email, otp);
        return ResponseEntity.ok(response);
    }
}