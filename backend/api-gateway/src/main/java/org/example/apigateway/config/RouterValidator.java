package org.example.apigateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {
    public static List<String>openEndPoints = List.of("");

    public static final String openApiPrefix = "/users/auth";

    public Predicate<ServerHttpRequest> isSecured = request -> {
        String path = request.getURI().getPath();

        if (path.startsWith(openApiPrefix)) {
            return false;
        }

        return openEndPoints.stream().noneMatch(path::equals);
    };
}
