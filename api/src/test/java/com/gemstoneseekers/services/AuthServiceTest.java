package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.CompleteRegistrationRequest;
import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.models.UserRole;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

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
    private final AuthService authService = new AuthService(userRepository, passwordEncoder);

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

        when(userRepository.findById(userId)).thenReturn(java.util.Optional.of(existingUser));
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

        when(userRepository.findById(userId)).thenReturn(java.util.Optional.empty());

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

        when(userRepository.findById(userId)).thenReturn(java.util.Optional.of(existingUser));

        assertThatThrownBy(() -> authService.completeRegistration(userId, request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("Registration already completed");

        verify(userRepository, never()).save(any());
    }
}
