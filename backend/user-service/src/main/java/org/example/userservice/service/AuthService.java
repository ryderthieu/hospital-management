package org.example.userservice.service;

import io.jsonwebtoken.Claims;
import org.example.userservice.client.PatientServiceClient;
import org.example.userservice.dto.AuthDTOs;
import org.example.userservice.dto.PatientDTO;
import org.example.userservice.entity.User;
import org.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PatientServiceClient patientServiceClient;
    private final OtpService otpService;

    // Lưu trữ thông tin đăng ký tạm thời
    private final Map<String, AuthDTOs.RegisterRequest> pendingRegistrations = new ConcurrentHashMap<>();

    @Autowired
    public AuthService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder, 
                      JwtService jwtService,
                      PatientServiceClient patientServiceClient,
                      OtpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.patientServiceClient = patientServiceClient;
        this.otpService = otpService;
    }

    public void preRegister(AuthDTOs.RegisterRequest request) {
        System.out.println("Bắt đầu preRegister với số điện thoại: " + request.getPhone());
        // Kiểm tra số điện thoại đã tồn tại chưa
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }

        // Kiểm tra giá trị gender hợp lệ
        String gender = request.getGender().toUpperCase();
        if (!gender.equals("MALE") && !gender.equals("FEMALE") && !gender.equals("OTHER")) {
            throw new RuntimeException("Giới tính không hợp lệ. Chỉ chấp nhận: MALE, FEMALE, OTHER");
        }

        // Lưu thông tin đăng ký tạm thời
        pendingRegistrations.put(request.getPhone(), request);
        System.out.println("Đã lưu thông tin đăng ký tạm thời cho số điện thoại: " + request.getPhone());
    }

    @Transactional
    public AuthDTOs.UserResponse completeRegistration(AuthDTOs.RegisterVerifyRequest verifyRequest) {
        System.out.println("Bắt đầu completeRegistration với số điện thoại: " + verifyRequest.getPhone());
        // Lấy thông tin đăng ký tạm thời
        AuthDTOs.RegisterRequest registerRequest = pendingRegistrations.get(verifyRequest.getPhone());
        if (registerRequest == null) {
            System.out.println("Không tìm thấy thông tin đăng ký cho số điện thoại: " + verifyRequest.getPhone());
            throw new RuntimeException("Không tìm thấy thông tin đăng ký");
        }
        System.out.println("Đã tìm thấy thông tin đăng ký tạm thời: " + registerRequest);

        // Xác thực OTP
        String phone = verifyRequest.getPhone();
        if (phone.startsWith("0")) {
            phone = "84" + phone.substring(1);
        }
        AuthDTOs.OtpValidationResponse otpResponse = otpService.validateOtp(phone, verifyRequest.getOtp());
        
        if (otpResponse == null || otpResponse.getResetToken() == null) {
            System.out.println("Lỗi xác thực OTP: " + verifyRequest.getPhone());
            throw new RuntimeException("Lỗi không xác định khi xác thực OTP");
        }

        String resetToken = otpResponse.getResetToken();
        if ("INVALID_PHONE".equals(resetToken)) {
            throw new RuntimeException("Số điện thoại không hợp lệ hoặc chưa được gửi mã OTP");
        }
        if ("INVALID_OTP".equals(resetToken)) {
            throw new RuntimeException("Mã OTP không chính xác");
        }
        if (!"SUCCESS".equals(resetToken)) {
            throw new RuntimeException("Lỗi xác thực OTP");
        }

        System.out.println("Xác thực OTP thành công");

        try {
            // Tạo user mới
            User user = new User();
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setPhone(registerRequest.getPhone());
            user.setRole(User.Role.PATIENT);

            // Lưu user vào database
            User savedUser = userRepository.save(user);
            System.out.println("Đã lưu user với ID: " + savedUser.getUserId());

            // Tạo thông tin bệnh nhân
            PatientDTO patientDTO = PatientDTO.builder()
                .userId(savedUser.getUserId().intValue())
                .identityNumber(registerRequest.getIdentityNumber())
                .insuranceNumber(registerRequest.getInsuranceNumber())
                .fullName(registerRequest.getFullName())
                .phone(registerRequest.getPhone())
                .birthday(registerRequest.getBirthday())
                .gender(registerRequest.getGender().toUpperCase())
                .address(registerRequest.getAddress())
                .build();
            System.out.println("PatientDTO được tạo: " + patientDTO);

            try {
                PatientDTO createdPatient = patientServiceClient.createPatient(patientDTO);
                System.out.println("Đã tạo patient thành công: " + createdPatient);
            } catch (Exception e) {
                System.out.println("Lỗi khi gọi patient service: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Lỗi khi tạo thông tin bệnh nhân: " + e.getMessage());
            }

            // Xóa thông tin đăng ký tạm thời
            pendingRegistrations.remove(verifyRequest.getPhone());
            System.out.println("Đã xóa thông tin đăng ký tạm thời");

            // Trả về thông tin user đã đăng ký
            return convertToUserResponse(savedUser);
        } catch (Exception e) {
            // Nếu có lỗi, xóa thông tin đăng ký tạm thời
            pendingRegistrations.remove(verifyRequest.getPhone());
            System.out.println("Lỗi trong quá trình đăng ký: " + e.getMessage());
            throw new RuntimeException("Không thể hoàn tất đăng ký: " + e.getMessage());
        }
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
        return new AuthDTOs.LoginResponse(token);
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