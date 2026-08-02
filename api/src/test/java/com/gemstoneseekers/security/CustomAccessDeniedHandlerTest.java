package com.gemstoneseekers.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gemstoneseekers.dtos.response.BaseResponse;

class CustomAccessDeniedHandlerTest {

    private final CustomAccessDeniedHandler handler = new CustomAccessDeniedHandler();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldReturn403WithBaseResponseWhenAccessDenied() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        AccessDeniedException exception = new AccessDeniedException("Access denied");

        handler.handle(request, response, exception);

        assertThat(response.getStatus()).isEqualTo(HttpStatus.FORBIDDEN.value());
        assertThat(response.getContentType()).isEqualTo(MediaType.APPLICATION_JSON_VALUE);

        BaseResponse<Void> body = objectMapper.readValue(response.getContentAsString(),
                new com.fasterxml.jackson.core.type.TypeReference<>() {
                });
        assertThat(body.success()).isFalse();
        assertThat(body.message()).isEqualTo("Access denied");
        assertThat(body.error().code()).isEqualTo("ACCESS_DENIED");
        assertThat(body.error().message()).isEqualTo("You do not have permission to access this resource");
        assertThat(body.error().validations()).isNull();
    }
}
