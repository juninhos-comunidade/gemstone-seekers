package com.gemstoneseekers.controllers.advice;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.core.MethodParameter;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.lang.reflect.Method;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void shouldHandleMethodArgumentNotValid() {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "userRequest");
        FieldError fieldError = new FieldError("userRequest", "email", "Email must be valid");
        bindingResult.addError(fieldError);
        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(methodParameter(), bindingResult);
        WebRequest request = mock(WebRequest.class);
        HttpHeaders headers = new HttpHeaders();

        ResponseEntity<Object> response = handler.handleMethodArgumentNotValid(ex, headers, HttpStatus.BAD_REQUEST,
                request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        @SuppressWarnings("unchecked")
        BaseResponse<Void> body = (BaseResponse<Void>) response.getBody();
        assertThat(body.success()).isFalse();
        assertThat(body.message()).isEqualTo("Validation failed");
        assertThat(body.error().code()).isEqualTo("VALIDATION_ERROR");
        assertThat(body.error().validations()).isNotNull();
        assertThat(body.error().validations()).hasSize(1);
        assertThat(body.error().validations().getFirst().field()).isEqualTo("email");
        assertThat(body.error().validations().getFirst().message()).isEqualTo("Email must be valid");
    }

    @Test
    void shouldHandleEntityNotFoundException() {
        EntityNotFoundException ex = new EntityNotFoundException("Candidate", UUID.randomUUID());

        ResponseEntity<BaseResponse<Void>> response = handler.handleEntityNotFound(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().error().code()).isEqualTo("NOT_FOUND");
    }

    @Test
    void shouldHandleIllegalArgumentException() {
        IllegalArgumentException ex = new IllegalArgumentException("Invalid input argument");

        ResponseEntity<BaseResponse<Void>> response = handler.handleIllegalArgument(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().error().code()).isEqualTo("INVALID_ARGUMENT");
        assertThat(response.getBody().error().message()).isEqualTo("Invalid input argument");
    }

    @Test
    void shouldHandleConflictException() {
        ConflictException ex = new ConflictException("Email already in use");

        ResponseEntity<BaseResponse<Void>> response = handler.handleConflictException(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().error().code()).isEqualTo("CONFLICT");
        assertThat(response.getBody().error().message()).isEqualTo("Email already in use");
    }

    @Test
    void shouldHandleAccessDeniedException() {
        AccessDeniedException ex = new AccessDeniedException("User missing required role");

        ResponseEntity<BaseResponse<Void>> response = handler.handleAccessDeniedException(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().error().code()).isEqualTo("ACCESS_DENIED");
        assertThat(response.getBody().error().message()).isEqualTo("User missing required role");
    }

    @Test
    void shouldHandleGenericException() {
        Exception ex = new Exception("Unexpected runtime crash");

        ResponseEntity<BaseResponse<Void>> response = handler.handleGenericException(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().error().code()).isEqualTo("INTERNAL_ERROR");
        assertThat(response.getBody().message()).isEqualTo("Internal server error");
    }

    @Test
    void shouldHandleHttpMessageNotReadable() {
        HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);
        WebRequest request = mock(WebRequest.class);
        HttpHeaders headers = new HttpHeaders();

        ResponseEntity<Object> response = handler.handleHttpMessageNotReadable(ex, headers, HttpStatus.BAD_REQUEST,
                request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        @SuppressWarnings("unchecked")
        BaseResponse<Void> body = (BaseResponse<Void>) response.getBody();
        assertThat(body.success()).isFalse();
        assertThat(body.error().code()).isEqualTo("MALFORMED_JSON");
    }

    @Test
    void shouldHandleHttpRequestMethodNotSupported() {
        org.springframework.web.HttpRequestMethodNotSupportedException ex = new org.springframework.web.HttpRequestMethodNotSupportedException(
                "POST");
        WebRequest request = mock(WebRequest.class);
        HttpHeaders headers = new HttpHeaders();

        ResponseEntity<Object> response = handler.handleHttpRequestMethodNotSupported(ex, headers,
                HttpStatus.METHOD_NOT_ALLOWED, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.METHOD_NOT_ALLOWED);
        assertThat(response.getBody()).isNotNull();
        @SuppressWarnings("unchecked")
        BaseResponse<Void> body = (BaseResponse<Void>) response.getBody();
        assertThat(body.success()).isFalse();
        assertThat(body.error().code()).isEqualTo("METHOD_NOT_ALLOWED");
    }

    @Test
    void shouldHandleTypeMismatch() {
        MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
        when(ex.getName()).thenReturn("id");
        when(ex.getRequiredType()).thenReturn((Class) UUID.class);

        ResponseEntity<BaseResponse<Void>> response = handler.handleTypeMismatch(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().error().code()).isEqualTo("INVALID_PARAMETER");
        assertThat(response.getBody().message()).isEqualTo("Parameter 'id' should be of type 'UUID'");
    }

    @Test
    void shouldHandleTypeMismatchWhenRequiredTypeIsNull() {
        MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
        when(ex.getName()).thenReturn("id");
        when(ex.getRequiredType()).thenReturn(null);

        ResponseEntity<BaseResponse<Void>> response = handler.handleTypeMismatch(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().error().code()).isEqualTo("INVALID_PARAMETER");
        assertThat(response.getBody().message()).isEqualTo("Parameter 'id' should be of type 'unknown'");
    }

    @Test
    void shouldHandleDataIntegrityViolation() {
        org.springframework.dao.DataIntegrityViolationException ex = new org.springframework.dao.DataIntegrityViolationException(
                "FK constraint fail");

        ResponseEntity<BaseResponse<Void>> response = handler.handleDataIntegrityViolation(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().error().code()).isEqualTo("DATA_INTEGRITY_VIOLATION");
    }

    private static MethodParameter methodParameter() {
        try {
            Method method = GlobalExceptionHandlerTest.class.getDeclaredMethod("invalidPayload", String.class);
            return new MethodParameter(method, 0);
        } catch (NoSuchMethodException e) {
            throw new IllegalStateException(e);
        }
    }

    @SuppressWarnings("unused")
    private void invalidPayload(String email) {
    }
}
