package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.CompleteRegistrationRequest;
import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CompleteRegistrationResponse;
import com.gemstoneseekers.dtos.response.RegisterResponse;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.models.UserRole;
import com.gemstoneseekers.services.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    private final AuthService authService = mock(AuthService.class);
    private final UserMapper userMapper = mock(UserMapper.class);
    private final AuthController authController = new AuthController(authService, userMapper);

    @Test
    void shouldReturnCreatedWithUserDataOnSuccessfulRegistration() {
        RegisterRequest request = new RegisterRequest(
            "John Doe",
            "john@example.com",
            "plainPassword123"
        );

        UUID userId    = UUID.randomUUID();
        User savedUser = new User();
        savedUser.setId(userId);
        savedUser.setName("John Doe");
        savedUser.setEmail("john@example.com");
        savedUser.setPassword("$2a$10$encodedPassword");

        RegisterResponse expectedResponse = new RegisterResponse(
            userId,
            "John Doe",
            "john@example.com"
        );

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
            "plainPassword123"
        );

        when(authService.register(request)).thenThrow(new ConflictException("Email already in use"));

        assertThatThrownBy(() -> authController.register(request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("Email already in use");
    }

    @Test
    void shouldReturnOkWithUserDataOnSuccessfulCompleteRegistration() {
        UUID userId = UUID.randomUUID();
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(
            UserRole.CANDIDATE,
            "CPF",
            "12345678900"
        );

        User updatedUser = new User();
        updatedUser.setId(userId);
        updatedUser.setName("John Doe");
        updatedUser.setEmail("john@example.com");
        updatedUser.setRole(UserRole.CANDIDATE);
        updatedUser.setDocumentType("CPF");
        updatedUser.setDocumentNumber("12345678900");

        CompleteRegistrationResponse expectedResponse = new CompleteRegistrationResponse(
            userId,
            "John Doe",
            "john@example.com",
            UserRole.CANDIDATE,
            "CPF",
            "12345678900"
        );

        when(authService.completeRegistration(userId, request)).thenReturn(updatedUser);
        when(userMapper.toCompleteRegistrationResponse(updatedUser)).thenReturn(expectedResponse);

        ResponseEntity<BaseResponse<CompleteRegistrationResponse>> response =
            authController.completeRegistration(userId, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().result()).isEqualTo(expectedResponse);
    }

    @Test
    void shouldPropagateConflictExceptionWhenRegistrationAlreadyCompleted() {
        UUID userId = UUID.randomUUID();
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(
            UserRole.CANDIDATE,
            null,
            null
        );

        when(authService.completeRegistration(userId, request))
            .thenThrow(new ConflictException("Registration already completed"));

        assertThatThrownBy(() -> authController.completeRegistration(userId, request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("Registration already completed");
    }

    @Test
    void shouldPropagateEntityNotFoundExceptionWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(
            UserRole.CANDIDATE,
            null,
            null
        );

        when(authService.completeRegistration(userId, request))
            .thenThrow(new EntityNotFoundException("User", userId));

        assertThatThrownBy(() -> authController.completeRegistration(userId, request))
            .isInstanceOf(EntityNotFoundException.class);
    }
}
