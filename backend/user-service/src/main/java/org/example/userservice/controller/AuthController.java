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
    public ResponseEntity<AuthDTOs.UserResponse> register(@Valid @RequestBody AuthDTOs.RegisterRequest request) {
        AuthDTOs.UserResponse response = userService.register(request);
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
    public String sendOtp(@RequestParam String phoneNumber) {
        otpService.sendOtp(phoneNumber);
        return "Đã gửi OTP tới " + phoneNumber;
    }

    @PostMapping("/otp/validate-sms")
    public AuthDTOs.OtpValidationResponse validateOtp(@RequestParam String phoneNumber, @RequestParam String otp) {
        return otpService.validateOtp(phoneNumber, otp);
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