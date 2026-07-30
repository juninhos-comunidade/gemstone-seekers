package com.gemstoneseekers.services;

import com.gemstoneseekers.models.User;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtService(
        @Value("${jwt.secret}") String secret,
        @Value("${jwt.access-token.expiration}") long accessTokenExpiration,
        @Value("${jwt.refresh-token.expiration}") long refreshTokenExpiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String generateAccessToken(User user) {
        return null;
    }

    public String generateRefreshToken(User user) {
        return null;
    }

    public boolean isTokenValid(String token) {
        return false;
    }

    public String extractEmail(String token) {
        return null;
    }
}
