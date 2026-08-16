package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.CompleteRegistrationRequest;
import com.gemstoneseekers.dtos.request.LoginRequest;
import com.gemstoneseekers.dtos.request.RefreshTokenRequest;
import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CompleteRegistrationResponse;
import com.gemstoneseekers.dtos.response.LoginResponse;
import com.gemstoneseekers.dtos.response.RegisterResponse;
import com.gemstoneseekers.enums.UserRole;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.services.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

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
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "plainPassword123");

        UUID userId = UUID.randomUUID();
        User savedUser = new User();
        savedUser.setId(userId);
        savedUser.setName("John Doe");
        savedUser.setEmail("john@example.com");
        savedUser.setPassword("$2a$10$encodedPassword");

        RegisterResponse expectedResponse = new RegisterResponse(userId, "John Doe", "john@example.com");

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
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "plainPassword123");

        when(authService.register(request)).thenThrow(new ConflictException("Email already in use"));

        assertThatThrownBy(() -> authController.register(request)).isInstanceOf(ConflictException.class).hasMessage(
                "Email already in use");
    }

    @Test
    void shouldReturnOkWithUserDataOnSuccessfulCompleteRegistration() {
        String email = "john@example.com";
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.CANDIDATE, "CPF", "12345678900",
                null, null, null, null);

        UUID userId = UUID.randomUUID();
        User updatedUser = new User();
        updatedUser.setId(userId);
        updatedUser.setName("John Doe");
        updatedUser.setEmail(email);
        updatedUser.setRole(UserRole.CANDIDATE);
        updatedUser.setDocumentType("CPF");
        updatedUser.setDocumentNumber("12345678900");

        CompleteRegistrationResponse expectedResponse = new CompleteRegistrationResponse(userId, "John Doe", email,
                UserRole.CANDIDATE, "CPF", "12345678900");

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(email);

        when(authService.completeRegistration(email, request)).thenReturn(updatedUser);
        when(userMapper.toCompleteRegistrationResponse(updatedUser)).thenReturn(expectedResponse);

        ResponseEntity<BaseResponse<CompleteRegistrationResponse>> response = authController.completeRegistration(
                userDetails, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().result()).isEqualTo(expectedResponse);
    }

    @Test
    void shouldPropagateConflictExceptionWhenRegistrationAlreadyCompleted() {
        String email = "john@example.com";
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.CANDIDATE, null, null, null,
                null, null, null);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(email);

        when(authService.completeRegistration(email, request)).thenThrow(new ConflictException(
                "Registration already completed"));

        assertThatThrownBy(() -> authController.completeRegistration(userDetails, request)).isInstanceOf(
                ConflictException.class).hasMessage("Registration already completed");
    }

    @Test
    void shouldPropagateEntityNotFoundExceptionWhenUserNotFound() {
        String email = "unknown@example.com";
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.CANDIDATE, null, null, null,
                null, null, null);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(email);

        when(authService.completeRegistration(email, request)).thenThrow(new EntityNotFoundException("User", email));

        assertThatThrownBy(() -> authController.completeRegistration(userDetails, request)).isInstanceOf(
                EntityNotFoundException.class);
    }

    @Test
    void shouldReturnOkWithTokensOnSuccessfulLogin() {
        LoginRequest request = new LoginRequest("john@example.com", "plainPassword123");

        LoginResponse expectedResponse = new LoginResponse("access-token", "refresh-token", true, "CANDIDATE");

        when(authService.login(request)).thenReturn(expectedResponse);

        ResponseEntity<BaseResponse<LoginResponse>> response = authController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().result()).isEqualTo(expectedResponse);
    }

    @Test
    void shouldPropagateAccessDeniedExceptionWhenCredentialsAreInvalid() {
        LoginRequest request = new LoginRequest("john@example.com", "wrongPassword");

        when(authService.login(request)).thenThrow(new AccessDeniedException("Invalid email or password"));

        assertThatThrownBy(() -> authController.login(request)).isInstanceOf(AccessDeniedException.class).hasMessage(
                "Invalid email or password");
    }

    @Test
    void shouldReturnOkWithNewTokensOnSuccessfulRefresh() {
        RefreshTokenRequest request = new RefreshTokenRequest("valid.refresh.token");

        LoginResponse expectedResponse = new LoginResponse("new-access-token", "new-refresh-token", true, "CANDIDATE");

        when(authService.refreshToken("valid.refresh.token")).thenReturn(expectedResponse);

        ResponseEntity<BaseResponse<LoginResponse>> response = authController.refresh(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().result()).isEqualTo(expectedResponse);
    }

    @Test
    void shouldPropagateAccessDeniedExceptionWhenRefreshTokenIsInvalid() {
        RefreshTokenRequest request = new RefreshTokenRequest("invalid.refresh.token");

        when(authService.refreshToken("invalid.refresh.token")).thenThrow(new AccessDeniedException(
                "Invalid refresh token"));

        assertThatThrownBy(() -> authController.refresh(request)).isInstanceOf(AccessDeniedException.class).hasMessage(
                "Invalid refresh token");
    }
}
