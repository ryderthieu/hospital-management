package org.example.doctorservice.client;

import org.example.doctorservice.dto.UserDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserServiceClient {
    private final RestTemplate restTemplate;

    public UserServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public UserDto addUser(UserDto userDto) {
        String url = "http://user-service/users";
        
        // Thêm header xác thực
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", "1"); // ID của admin
        headers.set("X-User-Role", "ADMIN"); // Không cần thêm ROLE_ vì filter sẽ tự thêm

        HttpEntity<UserDto> request = new HttpEntity<>(userDto, headers);
        
        return restTemplate.postForObject(url, request, UserDto.class);
    }
}