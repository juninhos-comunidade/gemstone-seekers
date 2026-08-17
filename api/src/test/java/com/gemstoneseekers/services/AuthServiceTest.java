package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.CompleteRegistrationRequest;
import com.gemstoneseekers.dtos.request.LoginRequest;
import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.dtos.response.LoginResponse;
import com.gemstoneseekers.enums.UserRole;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.CompanyRepository;
import com.gemstoneseekers.repositories.RecruiterRepository;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private CandidateRepository candidateRepository;
    @Mock
    private RecruiterRepository recruiterRepository;
    @Mock
    private CompanyRepository companyRepository;

    @Captor
    private ArgumentCaptor<User> userCaptor;
    @Captor
    private ArgumentCaptor<Candidate> candidateCaptor;
    @Captor
    private ArgumentCaptor<Recruiter> recruiterCaptor;

    @Nested
    @DisplayName("register()")
    class Register {

        @Test
        @DisplayName("should create and save a new user successfully")
        void shouldCreateAndSaveNewUser() {
            var request = new RegisterRequest("John Doe", "john.doe@example.com", "password123");
            var encodedPassword = "encodedPassword";

            when(userRepository.existsByEmail(request.email())).thenReturn(false);
            when(passwordEncoder.encode(request.password())).thenReturn(encodedPassword);
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            authService.register(request);

            verify(userRepository).save(userCaptor.capture());
            User savedUser = userCaptor.getValue();

            assertThat(savedUser.getName()).isEqualTo(request.name());
            assertThat(savedUser.getEmail()).isEqualTo(request.email());
            assertThat(savedUser.getPassword()).isEqualTo(encodedPassword);
        }

        @Test
        @DisplayName("should throw ConflictException when email is already in use")
        void shouldThrowConflictException_whenEmailIsInUse() {
            var request = new RegisterRequest("Jane Doe", "jane.doe@example.com", "password123");
            when(userRepository.existsByEmail(request.email())).thenReturn(true);

            assertThatThrownBy(() -> authService.register(request))
                    .isInstanceOf(ConflictException.class)
                    .hasMessage("Email already in use");

            verify(userRepository).existsByEmail(request.email());
            verify(passwordEncoder, never()).encode(anyString());
            verify(userRepository, never()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("completeRegistration()")
    class CompleteRegistration {

        @Test
        @DisplayName("should complete registration for a CANDIDATE")
        void shouldCompleteForCandidate() {
            String email = "candidate@test.com";
            var request = new CompleteRegistrationRequest(UserRole.CANDIDATE, "CPF", "12345", "555-1234", "A summary", null, null);
            User user = new User();
            user.setEmail(email);

            when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

            authService.completeRegistration(email, request);

            verify(userRepository).save(userCaptor.capture());
            User savedUser = userCaptor.getValue();
            assertThat(savedUser.getRole()).isEqualTo(UserRole.CANDIDATE);
            assertThat(savedUser.getDocumentType()).isEqualTo("CPF");

            verify(candidateRepository).save(candidateCaptor.capture());
            Candidate savedCandidate = candidateCaptor.getValue();
            assertThat(savedCandidate.getUser()).isEqualTo(savedUser);
            assertThat(savedCandidate.getPhone()).isEqualTo("555-1234");
            assertThat(savedCandidate.getSummary()).isEqualTo("A summary");
            verify(recruiterRepository, never()).save(any());
        }

        @Test
        @DisplayName("should complete registration for a RECRUITER")
        void shouldCompleteForRecruiter() {
            String email = "recruiter@test.com";
            UUID companyId = UUID.randomUUID();
            var request = new CompleteRegistrationRequest(UserRole.RECRUITER, "CNPJ", "54321", null, null, companyId, "HR");
            User user = new User();
            user.setEmail(email);
            Company company = new Company();
            company.setId(companyId);

            when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
            when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
            when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

            authService.completeRegistration(email, request);

            verify(userRepository).save(userCaptor.capture());
            User savedUser = userCaptor.getValue();
            assertThat(savedUser.getRole()).isEqualTo(UserRole.RECRUITER);

            verify(recruiterRepository).save(recruiterCaptor.capture());
            Recruiter savedRecruiter = recruiterCaptor.getValue();
            assertThat(savedRecruiter.getUser()).isEqualTo(savedUser);
            assertThat(savedRecruiter.getCompany()).isEqualTo(company);
            assertThat(savedRecruiter.getDepartment()).isEqualTo("HR");
            verify(candidateRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw EntityNotFoundException if user not found")
        void shouldThrowEntityNotFound_whenUserNotFound() {
            String email = "notfound@test.com";
            var request = new CompleteRegistrationRequest(UserRole.CANDIDATE, null, null, null, null, null, null);
            when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.completeRegistration(email, request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("User");
        }

        @Test
        @DisplayName("should throw ConflictException if registration already completed")
        void shouldThrowConflict_whenAlreadyCompleted() {
            String email = "completed@test.com";
            var request = new CompleteRegistrationRequest(UserRole.CANDIDATE, null, null, null, null, null, null);
            User user = new User();
            user.setEmail(email);
            user.setRole(UserRole.CANDIDATE);

            when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

            assertThatThrownBy(() -> authService.completeRegistration(email, request))
                    .isInstanceOf(ConflictException.class)
                    .hasMessage("Registration already completed");
        }

        @Test
        @DisplayName("should throw EntityNotFoundException if company not found for RECRUITER")
        void shouldThrowEntityNotFound_whenCompanyNotFoundForRecruiter() {
            String email = "recruiter@test.com";
            UUID companyId = UUID.randomUUID();
            var request = new CompleteRegistrationRequest(UserRole.RECRUITER, null, null, null, null, companyId, null);
            User user = new User();
            user.setEmail(email);

            when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
            when(companyRepository.findById(companyId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.completeRegistration(email, request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("Company");
        }
    }

    @Nested
    @DisplayName("login()")
    class Login {

        @Test
        @DisplayName("should return tokens for valid credentials")
        void shouldReturnTokens_forValidCredentials() {
            var request = new LoginRequest("user@test.com", "password");
            User user = new User();
            user.setEmail(request.email());
            user.setPassword("encodedPassword");
            user.setRole(UserRole.CANDIDATE);

            when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
            when(passwordEncoder.matches(request.password(), user.getPassword())).thenReturn(true);
            when(jwtService.generateAccessToken(user)).thenReturn("access_token");
            when(jwtService.generateRefreshToken(user)).thenReturn("refresh_token");

            LoginResponse response = authService.login(request);

            assertThat(response.accessToken()).isEqualTo("access_token");
            assertThat(response.refreshToken()).isEqualTo("refresh_token");
            assertThat(response.registrationCompleted()).isTrue();
        }

        @Test
        @DisplayName("should throw AccessDeniedException for invalid email")
        void shouldThrowAccessDenied_forInvalidEmail() {
            var request = new LoginRequest("invalid@test.com", "password");
            when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("Invalid email or password");
        }

        @Test
        @DisplayName("should throw AccessDeniedException for invalid password")
        void shouldThrowAccessDenied_forInvalidPassword() {
            var request = new LoginRequest("user@test.com", "wrong_password");
            User user = new User();
            user.setEmail(request.email());
            user.setPassword("encodedPassword");

            when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
            when(passwordEncoder.matches(request.password(), user.getPassword())).thenReturn(false);

            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("Invalid email or password");
        }
    }

    @Nested
    @DisplayName("refreshToken()")
    class RefreshToken {

        @Test
        @DisplayName("should return new tokens for a valid refresh token")
        void shouldReturnNewTokens_forValidRefreshToken() {
            String refreshToken = "valid_refresh_token";
            String email = "user@test.com";
            User user = new User();
            user.setEmail(email);
            user.setRole(UserRole.CANDIDATE);

            when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
            when(jwtService.extractEmail(refreshToken)).thenReturn(email);
            when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
            when(jwtService.generateAccessToken(user)).thenReturn("new_access_token");
            when(jwtService.generateRefreshToken(user)).thenReturn("new_refresh_token");

            LoginResponse response = authService.refreshToken(refreshToken);

            assertThat(response.accessToken()).isEqualTo("new_access_token");
            assertThat(response.refreshToken()).isEqualTo("new_refresh_token");
        }

        @Test
        @DisplayName("should throw AccessDeniedException for an invalid refresh token")
        void shouldThrowAccessDenied_forInvalidToken() {
            String invalidToken = "invalid_token";
            when(jwtService.isTokenValid(invalidToken)).thenReturn(false);

            assertThatThrownBy(() -> authService.refreshToken(invalidToken))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("Invalid refresh token");
        }

        @Test
        @DisplayName("should throw AccessDeniedException if user from token not found")
        void shouldThrowAccessDenied_whenUserNotFound() {
            String refreshToken = "valid_token_unknown_user";
            String email = "unknown@test.com";

            when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
            when(jwtService.extractEmail(refreshToken)).thenReturn(email);
            when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.refreshToken(refreshToken))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("Invalid refresh token");
        }
    }
}
