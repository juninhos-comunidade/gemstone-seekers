package com.gemstoneseekers.security;

import com.gemstoneseekers.enums.UserRole;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CustomUserDetailsServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final CustomUserDetailsService userDetailsService = new CustomUserDetailsService(userRepository);

    @Test
    void shouldLoadUserByEmailWhenUserExists() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("john@example.com");
        user.setPassword("$2a$10$encodedPassword");
        user.setRole(UserRole.CANDIDATE);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        UserDetails result = userDetailsService.loadUserByUsername("john@example.com");

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("john@example.com");
        assertThat(result.getPassword()).isEqualTo("$2a$10$encodedPassword");
        assertThat(result.getAuthorities()).isNotEmpty();
        assertThat(result.getAuthorities().iterator().next().getAuthority()).isEqualTo("ROLE_CANDIDATE");
    }

    @Test
    void shouldLoadUserWithoutRole() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("jane@example.com");
        user.setPassword("$2a$10$encodedPassword");
        user.setRole(null);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));

        UserDetails result = userDetailsService.loadUserByUsername("jane@example.com");

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("jane@example.com");
        assertThat(result.getAuthorities()).isEmpty();
    }

    @Test
    void shouldThrowUsernameNotFoundExceptionWhenUserDoesNotExist() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("unknown@example.com")).isInstanceOf(
                UsernameNotFoundException.class).hasMessageContaining("unknown@example.com");
    }
}
