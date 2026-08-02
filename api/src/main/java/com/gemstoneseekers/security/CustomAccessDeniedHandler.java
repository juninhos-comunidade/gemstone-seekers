package com.gemstoneseekers.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public CustomAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(@NonNull HttpServletRequest request, HttpServletResponse response,
            @NonNull AccessDeniedException accessDeniedException) throws IOException {
        ErrorResponse error = new ErrorResponse("ACCESS_DENIED", "You do not have permission to access this resource",
                null);
        BaseResponse<Void> body = new BaseResponse<>(false, "Access denied", null, error);
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
