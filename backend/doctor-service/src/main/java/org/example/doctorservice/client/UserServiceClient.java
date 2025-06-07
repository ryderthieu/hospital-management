package org.example.doctorservice.client;

import org.example.doctorservice.dto.UserDto;
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
}