package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.CompleteRegistrationRequest;
import com.gemstoneseekers.dtos.request.LoginRequest;
import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.dtos.response.LoginResponse;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.models.UserRole;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterRequest request = new RegisterRequest(
            "John Doe",
            "john@example.com",
            "plainPassword123"
        );

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword123")).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = authService.register(request);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("John Doe");
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        assertThat(result.getPassword()).isEqualTo("$2a$10$encodedPassword");
        assertThat(result.getRole()).isNull();
        assertThat(result.getDocumentType()).isNull();
        assertThat(result.getDocumentNumber()).isNull();
        verify(passwordEncoder).encode("plainPassword123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowConflictExceptionWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
            "John Doe",
            "john@example.com",
            "plainPassword123"
        );

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("Email already in use");

        verify(passwordEncoder, never()).encode(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldCompleteRegistrationSuccessfully() {
        UUID userId = UUID.randomUUID();
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(
            UserRole.CANDIDATE,
            "CPF",
            "12345678900"
        );

        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setName("John Doe");
        existingUser.setEmail("john@example.com");
        existingUser.setPassword("$2a$10$encodedPassword");
        existingUser.setRole(null);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = authService.completeRegistration(userId, request);

        assertThat(result).isNotNull();
        assertThat(result.getRole()).isEqualTo(UserRole.CANDIDATE);
        assertThat(result.getDocumentType()).isEqualTo("CPF");
        assertThat(result.getDocumentNumber()).isEqualTo("12345678900");
        verify(userRepository).save(existingUser);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(
            UserRole.CANDIDATE,
            null,
            null
        );

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.completeRegistration(userId, request))
            .isInstanceOf(EntityNotFoundException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldThrowConflictExceptionWhenRegistrationAlreadyCompleted() {
        UUID userId = UUID.randomUUID();
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(
            UserRole.CANDIDATE,
            null,
            null
        );

        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setEmail("john@example.com");
        existingUser.setRole(UserRole.RECRUITER);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        assertThatThrownBy(() -> authService.completeRegistration(userId, request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("Registration already completed");

        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest("john@example.com", "plainPassword123");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("john@example.com");
        user.setPassword("$2a$10$encodedPassword");
        user.setRole(UserRole.CANDIDATE);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plainPassword123", "$2a$10$encodedPassword")).thenReturn(true);
        when(jwtService.generateAccessToken(user)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(user)).thenReturn("refresh-token");

        LoginResponse result = authService.login(request);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("access-token");
        assertThat(result.refreshToken()).isEqualTo("refresh-token");
        assertThat(result.registrationCompleted()).isTrue();
    }

    @Test
    void shouldReturnRegistrationCompletedFalseWhenRoleIsNull() {
        LoginRequest request = new LoginRequest("jane@example.com", "plainPassword123");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("jane@example.com");
        user.setPassword("$2a$10$encodedPassword");
        user.setRole(null);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plainPassword123", "$2a$10$encodedPassword")).thenReturn(true);
        when(jwtService.generateAccessToken(user)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(user)).thenReturn("refresh-token");

        LoginResponse result = authService.login(request);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("access-token");
        assertThat(result.refreshToken()).isEqualTo("refresh-token");
        assertThat(result.registrationCompleted()).isFalse();
    }

    @Test
    void shouldThrowAccessDeniedWhenUserNotFound() {
        LoginRequest request = new LoginRequest("john@example.com", "plainPassword123");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOf(AccessDeniedException.class)
            .hasMessage("Invalid email or password");

        verify(passwordEncoder, never()).matches(any(), any());
    }

    @Test
    void shouldThrowAccessDeniedWhenPasswordDoesNotMatch() {
        LoginRequest request = new LoginRequest("john@example.com", "wrongPassword");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("john@example.com");
        user.setPassword("$2a$10$encodedPassword");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "$2a$10$encodedPassword")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOf(AccessDeniedException.class)
            .hasMessage("Invalid email or password");

        verify(jwtService, never()).generateAccessToken(any());
        verify(jwtService, never()).generateRefreshToken(any());
    }
}
