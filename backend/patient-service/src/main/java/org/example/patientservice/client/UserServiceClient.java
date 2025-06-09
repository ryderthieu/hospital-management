package org.example.patientservice.client;

import org.example.patientservice.dto.UserDto;
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

    public UserDto getUserById(Integer userId) {
        String url = "http://user-service/users/"+userId;
        return restTemplate.getForObject(url, UserDto.class);
    }

    public UserDto addUser(UserDto userDto) {
        String url = "http://user-service/users";
        
        // Thêm header xác thực
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", "1"); // ID của admin
        headers.set("X-User-Role", "ADMIN");

        HttpEntity<UserDto> request = new HttpEntity<>(userDto, headers);
        
        return restTemplate.postForObject(url, request, UserDto.class);
    }
}
