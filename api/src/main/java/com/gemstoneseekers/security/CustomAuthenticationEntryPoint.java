package com.gemstoneseekers.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(@NonNull HttpServletRequest request, HttpServletResponse response,
            @NonNull AuthenticationException authException) throws IOException {
        ErrorResponse error = new ErrorResponse("UNAUTHENTICATED", "Authentication is required to access this resource",
                null);
        BaseResponse<Void> body = new BaseResponse<>(false, "Authentication is required", null, error);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
