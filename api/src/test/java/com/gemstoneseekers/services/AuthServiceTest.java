package com.gemstoneseekers.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.UserRepository;

class AuthServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final AuthService authService = new AuthService(userRepository, passwordEncoder);

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterRequest request = new RegisterRequest(
            "John Doe",
            "john@example.com",
            "plainPassword123");

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
            "plainPassword123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("Email already in use");

        verify(passwordEncoder, never()).encode(any());
        verify(userRepository, never()).save(any());
    }
}
