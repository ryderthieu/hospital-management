package org.example.apigateway.config;

import org.example.apigateway.security.JwtAuthFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    private final JwtAuthFilter jwtAuthFilter;
    public GatewayConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f.stripPrefix(1)  .filter(jwtAuthFilter))
                        .uri("lb://user-service"))
                .route("pharmacy-service", r -> r.path("/api/pharmacy/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthFilter))
                        .uri("lb://pharmacy-service"))
                .route("payment-service", r -> r.path("/api/payment/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthFilter))
                        .uri("lb://payment-service"))
                .route("patient-service", r -> r.path("/api/patient/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthFilter))
                        .uri("lb://patient-service"))
                .route("doctor-service", r -> r.path("/api/doctor/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthFilter))
                        .uri("lb://doctor-service"))
                .route("appointment-service", r -> r.path("/api/appointment/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthFilter))
                        .uri("lb://appointment-service"))
                .build();

    }
}
