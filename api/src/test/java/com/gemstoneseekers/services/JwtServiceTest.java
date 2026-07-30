package com.gemstoneseekers.services;

import com.gemstoneseekers.models.User;
import com.gemstoneseekers.models.UserRole;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String TEST_SECRET = "this-is-a-test-secret-key-with-at-least-32-bytes!!";
    private static final long ACCESS_TOKEN_EXPIRATION = 86400000L;
    private static final long REFRESH_TOKEN_EXPIRATION = 604800000L;

    private final JwtService jwtService = new JwtService(
        TEST_SECRET,
        ACCESS_TOKEN_EXPIRATION,
        REFRESH_TOKEN_EXPIRATION
    );

    @Test
    void shouldGenerateValidAccessToken() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("john@example.com");
        user.setRole(UserRole.CANDIDATE);

        String token = jwtService.generateAccessToken(user);

        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractEmail(token)).isEqualTo("john@example.com");
    }

    @Test
    void shouldGenerateValidRefreshToken() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("john@example.com");
        user.setRole(UserRole.CANDIDATE);

        String token = jwtService.generateRefreshToken(user);

        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    void shouldReturnFalseForInvalidToken() {
        assertThat(jwtService.isTokenValid("invalid.token.here")).isFalse();
    }

    @Test
    void shouldGenerateTokenForUserWithoutRole() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("jane@example.com");
        user.setRole(null);

        String token = jwtService.generateAccessToken(user);

        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractEmail(token)).isEqualTo("jane@example.com");
    }
}
