package com.gemstoneseekers.security;

import java.util.Collections;

import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gemstoneseekers.repositories.UserRepository;

@Service
@NullMarked
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).map(user -> User.builder().username(user.getEmail()).password(user
                .getPassword()).authorities(user.getRole() != null ? Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole()
                                .name())) : Collections.emptyList()).build()).orElseThrow(
                                        () -> new UsernameNotFoundException("User not found: " + email));
    }
}
