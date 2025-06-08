package com.example.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * A utility class for encoding passwords using BCryptPasswordEncoder.
 * This can be used to generate hashed passwords for secure storage.
 */
public class PasswordEncoder {

    public static void main(String[] args) {
        // Create an instance of BCryptPasswordEncoder
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Encode the password and print the result
        System.out.println(encoder.encode("admin123"));
    }
}
