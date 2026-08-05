package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.CompleteRegistrationRequest;
import com.gemstoneseekers.dtos.request.LoginRequest;
import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.dtos.response.LoginResponse;
import com.gemstoneseekers.enums.UserRole;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.CompanyRepository;
import com.gemstoneseekers.repositories.RecruiterRepository;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {
    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final CandidateRepository candidateRepository = mock(CandidateRepository.class);
    private final RecruiterRepository recruiterRepository = mock(RecruiterRepository.class);
    private final CompanyRepository companyRepository = mock(CompanyRepository.class);
    private final AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService,
            candidateRepository, recruiterRepository, companyRepository);

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "plainPassword123");
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
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "plainPassword123");
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);
        assertThatThrownBy(() -> authService.register(request)).isInstanceOf(ConflictException.class)
                .hasMessage("Email already in use");
        verify(passwordEncoder, never()).encode(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldCompleteRegistrationSuccessfully() {
        String email = "john@example.com";
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.CANDIDATE, "CPF", "12345678900",
                null, null, null, null);
        User existingUser = new User();
        existingUser.setId(UUID.randomUUID());
        existingUser.setName("John Doe");
        existingUser.setEmail(email);
        existingUser.setPassword("$2a$10$encodedPassword");
        existingUser.setRole(null);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        User result = authService.completeRegistration(email, request);
        assertThat(result).isNotNull();
        assertThat(result.getRole()).isEqualTo(UserRole.CANDIDATE);
        assertThat(result.getDocumentType()).isEqualTo("CPF");
        assertThat(result.getDocumentNumber()).isEqualTo("12345678900");
        verify(userRepository).save(existingUser);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenUserNotFound() {
        String email = "unknown@example.com";
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.CANDIDATE, null, null, null,
                null, null, null);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> authService.completeRegistration(email, request))
                .isInstanceOf(EntityNotFoundException.class);
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldThrowConflictExceptionWhenRegistrationAlreadyCompleted() {
        String email = "john@example.com";
        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.CANDIDATE, null, null, null,
                null, null, null);
        User existingUser = new User();
        existingUser.setId(UUID.randomUUID());
        existingUser.setEmail(email);
        existingUser.setRole(UserRole.RECRUITER);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));
        assertThatThrownBy(() -> authService.completeRegistration(email, request)).isInstanceOf(ConflictException.class)
                .hasMessage("Registration already completed");
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldCreateCandidateWhenRoleIsCandidate() {
        String email = "john@example.com";

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setPassword("$2a$10$encodedPassword");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.CANDIDATE, "CPF", "12345678900",
                "+5511999999999", "Java Developer", null, null);

        authService.completeRegistration(email, request);

        verify(candidateRepository).save(argThat(c -> c.getUser().getId().equals(user.getId())
                && c.getPhone().equals("+5511999999999") && c.getSummary().equals("Java Developer")));
        verify(recruiterRepository, never()).save(any());
    }

    @Test
    void shouldCreateRecruiterWhenRoleIsRecruiter() {
        String email = "jane@example.com";
        UUID companyId = UUID.randomUUID();

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setPassword("$2a$10$encodedPassword");

        Company company = new Company();
        company.setId(companyId);
        company.setName("Tech Corp");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));

        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.RECRUITER, "CNPJ",
                "12345678000190", null, null, companyId, "Engineering");

        authService.completeRegistration(email, request);

        verify(recruiterRepository).save(argThat(r -> r.getUser().getId().equals(user.getId())
                && r.getCompany().getId().equals(companyId) && r.getDepartment().equals("Engineering")));
        verify(candidateRepository, never()).save(any());
    }

    @Test
    void shouldThrowWhenCompanyNotFoundForRecruiter() {
        String email = "jane@example.com";
        UUID companyId = UUID.randomUUID();

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setPassword("$2a$10$encodedPassword");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(companyRepository.findById(companyId)).thenReturn(Optional.empty());

        CompleteRegistrationRequest request = new CompleteRegistrationRequest(UserRole.RECRUITER, "CNPJ",
                "12345678000190", null, null, companyId, "Engineering");

        assertThatThrownBy(() -> authService.completeRegistration(email, request))
                .isInstanceOf(EntityNotFoundException.class).hasMessageContaining("Company");

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
        assertThatThrownBy(() -> authService.login(request)).isInstanceOf(AccessDeniedException.class)
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
        assertThatThrownBy(() -> authService.login(request)).isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid email or password");
        verify(jwtService, never()).generateAccessToken(any());
        verify(jwtService, never()).generateRefreshToken(any());
    }

    @Test
    void shouldRefreshTokenSuccessfully() {
        String refreshToken = "valid.refresh.token";
        String email = "john@example.com";
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setPassword("$2a$10$encodedPassword");
        user.setRole(UserRole.CANDIDATE);
        when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractEmail(refreshToken)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(user)).thenReturn("new-access-token");
        when(jwtService.generateRefreshToken(user)).thenReturn("new-refresh-token");
        LoginResponse result = authService.refreshToken(refreshToken);
        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("new-access-token");
        assertThat(result.refreshToken()).isEqualTo("new-refresh-token");
        assertThat(result.registrationCompleted()).isTrue();
    }

    @Test
    void shouldThrowAccessDeniedWhenRefreshTokenIsInvalid() {
        String refreshToken = "invalid.refresh.token";
        when(jwtService.isTokenValid(refreshToken)).thenReturn(false);
        assertThatThrownBy(() -> authService.refreshToken(refreshToken)).isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid refresh token");
        verify(jwtService, never()).extractEmail(any());
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void shouldThrowAccessDeniedWhenUserNotFoundAfterRefresh() {
        String refreshToken = "valid.refresh.token";
        String email = "deleted@example.com";
        when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractEmail(refreshToken)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> authService.refreshToken(refreshToken)).isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid refresh token");
        verify(jwtService, never()).generateAccessToken(any());
        verify(jwtService, never()).generateRefreshToken(any());
    }

    @Test
    void shouldReturnRegistrationCompletedFalseWhenRoleIsNullOnRefresh() {
        String refreshToken = "valid.refresh.token";
        String email = "john@example.com";
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setPassword("$2a$10$encodedPassword");
        user.setRole(null);
        when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractEmail(refreshToken)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(user)).thenReturn("new-access-token");
        when(jwtService.generateRefreshToken(user)).thenReturn("new-refresh-token");
        LoginResponse result = authService.refreshToken(refreshToken);
        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("new-access-token");
        assertThat(result.refreshToken()).isEqualTo("new-refresh-token");
        assertThat(result.registrationCompleted()).isFalse();
    }
}
