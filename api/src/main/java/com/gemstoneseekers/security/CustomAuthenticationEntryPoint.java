package com.gemstoneseekers.security;

import java.io.IOException;

import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public void commence(@NonNull HttpServletRequest request, HttpServletResponse response,
            @NonNull AuthenticationException authException) throws IOException {
        ErrorResponse error = new ErrorResponse("UNAUTHENTICATED", "Authentication is required to access this resource",
                null);
        BaseResponse<Void> body = new BaseResponse<>(false, "Authentication is required", null, error);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(OBJECT_MAPPER.writeValueAsString(body));
    }
}
