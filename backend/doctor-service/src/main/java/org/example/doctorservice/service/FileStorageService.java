package org.example.doctorservice.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    private final Cloudinary cloudinary;

    public String storeFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "doctors",
                "resource_type", "auto"
            ));
            return uploadResult.get("secure_url").toString();
        } catch (IOException ex) {
            throw new RuntimeException("Không thể tải lên file: " + file.getOriginalFilename(), ex);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            // Lấy public_id từ URL
            String publicId = extractPublicIdFromUrl(fileUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException ex) {
            throw new RuntimeException("Không thể xóa file: " + fileUrl, ex);
        }
    }

    private String extractPublicIdFromUrl(String fileUrl) {
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/doctors/filename
        if (fileUrl == null || !fileUrl.contains("/upload/")) return null;
        
        String[] parts = fileUrl.split("/upload/");
        if (parts.length < 2) return null;
        
        // Lấy phần sau /upload/ và loại bỏ phần mở rộng file
        String path = parts[1].replaceAll("v\\d+/", ""); // Loại bỏ version number nếu có
        int extensionIndex = path.lastIndexOf(".");
        if (extensionIndex != -1) {
            path = path.substring(0, extensionIndex);
        }
        
        return path;
    }
} 