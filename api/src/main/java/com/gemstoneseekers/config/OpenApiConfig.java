package com.gemstoneseekers.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info().title("Gemstone Seekers API").description(
                "A knowledge validation and categorization system for directing selection processes").version("1.0.0")
                .contact(new Contact().name("Gemstone Seekers").url(
                        "https://github.com/juninhos-comunidade/gemstone-seekers")).license(new License().name(
                                "PolyForm Noncommercial License 1.0.0").url(
                                        "https://polyformproject.org/licenses/noncommercial/1.0.0"))).servers(List.of(
                                                new Server().url("/").description("Gemstone Seekers API"))).components(
                                                        new Components().addSecuritySchemes("bearer-jwt",
                                                                new SecurityScheme().type(SecurityScheme.Type.HTTP)
                                                                        .scheme("bearer").bearerFormat("JWT")
                                                                        .description(
                                                                                "Enter the JWT access token returned by POST /api/v1/auth/login")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}
