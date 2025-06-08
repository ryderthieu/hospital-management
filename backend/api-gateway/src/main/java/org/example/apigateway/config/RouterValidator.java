package org.example.apigateway.config;

import java.util.List;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

@Component
public class RouterValidator {

    //Danh sách api không cần xác thực
    private static final List<String> OPEN_ENDPOINTS = List.of(
            "/payment/bills/test/{id}",
            "/pharmacy/medicines/{id}",
            "/notifications",
            "/patients",
            "/doctors/departments"
    );

    //Có thể dưới dạng start with..
    private static final String OPEN_API_PREFIX = "/users/auth";
    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    public boolean isSecured(ServerHttpRequest request) {
        String path = request.getURI().getPath();

        if (path.startsWith(OPEN_API_PREFIX)) {
            return false;
        }

        return OPEN_ENDPOINTS.stream()
                .noneMatch(pattern -> pathMatcher.match(pattern, path));
    }
}

