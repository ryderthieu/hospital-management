package org.example.userservice.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.example.userservice.dto.AuthDTOs;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.entity.User;
import org.example.userservice.service.JwtService;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class OtpService {

    private static final String ACCOUNT_SID = "ACbe33df3f5037e2d59894c63ddf0d81f7";
    private static final String AUTH_TOKEN = "6bf831245b9ea5808363a94e77e91a33";
    private static final String FROM_PHONE_NUMBER = "+12186633832"; // Ví dụ: "+1415xxxxxxx"

    private static final int OTP_LENGTH = 6;

    // Lưu OTP tạm thời vào RAM
    private Map<String, String> otpStorage = new HashMap<>();

    private final SecureRandom random = new SecureRandom();

    private UserRepository userRepository;

    private JwtService jwtService;

    private final JavaMailSender mailSender;

    public OtpService(UserRepository userRepository, JwtService jwtService, JavaMailSender mailSender) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.mailSender = mailSender;
    }

    public String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10)); // Random số 0-9
        }
        return otp.toString();
    }

    public void sendOtp(String toPhoneNumber) {
        String phone = toPhoneNumber;
        if (toPhoneNumber.startsWith("84")) {
            phone = "0" + toPhoneNumber.substring(2);  // Chuyển +84 thành 0
        }
        userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        String otp = generateOtp();
        otpStorage.put(toPhoneNumber, otp);
        Message.creator(
                new PhoneNumber("+"+toPhoneNumber),
                new PhoneNumber(FROM_PHONE_NUMBER),
                "Mã OTP của bạn là: " + otp
        ).create();
    }

    public AuthDTOs.OtpValidationResponse validateOtp(String toPhoneNumber, String userInputOtp) {
        String correctOtp = otpStorage.get(toPhoneNumber);
        if (toPhoneNumber.startsWith("84")) {
            toPhoneNumber = "0" + toPhoneNumber.substring(2);  // Chuyển +84 thành 0
        }
        if (userInputOtp.equals(correctOtp)) {
            User user = userRepository.findByPhone(toPhoneNumber)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            String resetToken = jwtService.generateResetPasswordToken(user);

            return new AuthDTOs.OtpValidationResponse(resetToken);
        }

        return new AuthDTOs.OtpValidationResponse("Mã otp không đúng");
    }


    public void sendOtpToEmail(String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        String otp = generateOtp();
        otpStorage.put(email, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã OTP xác thực");
        message.setText("Mã OTP của bạn là: " + otp);

        mailSender.send(message);
    }

    public AuthDTOs.OtpValidationResponse validateOtpByEmail(String email, String userInputOtp) {
        String correctOtp = otpStorage.get(email);
        if (userInputOtp.equals(correctOtp)) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            String resetToken = jwtService.generateResetPasswordToken(user);

            return new AuthDTOs.OtpValidationResponse(resetToken);
        }

        return new AuthDTOs.OtpValidationResponse("Mã otp không đúng");
    }
}
