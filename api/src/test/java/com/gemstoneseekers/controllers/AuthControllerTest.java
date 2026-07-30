package com.gemstoneseekers.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.RegisterResponse;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.services.AuthService;

class AuthControllerTest {

    private final AuthService authService = mock(AuthService.class);
    private final UserMapper userMapper = mock(UserMapper.class);
    private final AuthController authController = new AuthController(authService, userMapper);

    @Test
    void shouldReturnCreatedWithUserDataOnSuccessfulRegistration() {
        RegisterRequest request = new RegisterRequest(
            "John Doe",
            "john@example.com",
            "plainPassword123");

        UUID userId = UUID.randomUUID();
        User savedUser = new User();
        savedUser.setId(userId);
        savedUser.setName("John Doe");
        savedUser.setEmail("john@example.com");
        savedUser.setPassword("$2a$10$encodedPassword");

        RegisterResponse expectedResponse = new RegisterResponse(
            userId,
            "John Doe",
            "john@example.com");

        when(authService.register(request)).thenReturn(savedUser);
        when(userMapper.toRegisterResponse(savedUser)).thenReturn(expectedResponse);

        ResponseEntity<BaseResponse<RegisterResponse>> response = authController.register(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().result()).isEqualTo(expectedResponse);
    }

    @Test
    void shouldPropagateConflictExceptionWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
            "John Doe",
            "john@example.com",
            "plainPassword123");

        when(authService.register(request)).thenThrow(new ConflictException("Email already in use"));

        assertThatThrownBy(() -> authController.register(request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("Email already in use");
    }
}
