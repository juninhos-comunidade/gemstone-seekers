package com.gemstoneseekers.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.BadCredentialsException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gemstoneseekers.dtos.response.BaseResponse;

class CustomAuthenticationEntryPointTest {

    private final CustomAuthenticationEntryPoint entryPoint = new CustomAuthenticationEntryPoint();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldReturn401WithBaseResponseWhenUnauthenticated() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException exception = new BadCredentialsException("Bad credentials");

        entryPoint.commence(request, response, exception);

        assertThat(response.getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
        assertThat(response.getContentType()).isEqualTo(MediaType.APPLICATION_JSON_VALUE);

        BaseResponse<Void> body = objectMapper.readValue(response.getContentAsString(),
                new com.fasterxml.jackson.core.type.TypeReference<>() {
                });
        assertThat(body.success()).isFalse();
        assertThat(body.message()).isEqualTo("Authentication is required");
        assertThat(body.error().code()).isEqualTo("UNAUTHENTICATED");
        assertThat(body.error().message()).isEqualTo("Authentication is required to access this resource");
        assertThat(body.error().validations()).isNull();
    }
}
