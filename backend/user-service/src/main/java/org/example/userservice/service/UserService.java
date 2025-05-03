package org.example.userservice.service;

import com.ctc.wstx.util.StringUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.example.userservice.dto.UserDTOs;
import org.example.userservice.entity.User;
import org.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDTOs.PagedResponse<UserDTOs.UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);

        List<UserDTOs.UserResponse> content = userPage.getContent().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());

        return new UserDTOs.PagedResponse<>(
                content,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }
    @Transactional
    public UserDTOs.UserResponse getUserById (Long userId) {
        User user = userRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return  mapToUserResponse(user);
    }

    @Transactional
    public UserDTOs.UserResponse addUser (UserDTOs.UserRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        User user = new User();
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Transactional
    public UserDTOs.UserResponse editUser (Long userId, UserDTOs.UserUpdateRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email đã được sử dụng");
            }
            user.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getPhone()) && !request.getPhone().equals(user.getPhone())) {
            if (userRepository.existsByPhone(request.getPhone())) {
                throw new IllegalArgumentException("Số điện thoại đã được sử dụng");
            }
            user.setPhone(request.getPhone());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        user = userRepository.save(user);

        return mapToUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Không tìm thấy người dùng");
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    private UserDTOs.UserResponse mapToUserResponse(User user) {
        return new UserDTOs.UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
    public boolean isCurrentUser(Long userId) {
        // Lấy request hiện tại
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return false;
        }

        HttpServletRequest request = attrs.getRequest();
        String headerUserId = request.getHeader("X-User-Id");
        if (headerUserId == null) {
            return false;
        }

        try {
            Long headerId = Long.valueOf(headerUserId);
            return headerId.equals(userId);
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    @Transactional
    public void changePassword (Long userId, UserDTOs.ChangePasswordRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

}