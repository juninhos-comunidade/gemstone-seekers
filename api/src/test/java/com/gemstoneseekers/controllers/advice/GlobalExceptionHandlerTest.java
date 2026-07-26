package com.gemstoneseekers.controllers.advice;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void shouldHandleMethodArgumentNotValid() {
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError = new FieldError("userRequest", "email", "Email must be valid");
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);

        WebRequest request = mock(WebRequest.class);
        HttpHeaders headers = new HttpHeaders();

        ResponseEntity<Object> response = handler.handleMethodArgumentNotValid(ex, headers, HttpStatus.BAD_REQUEST,
                request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        BaseResponse<Void> body = (BaseResponse<Void>) response.getBody();
        assertFalse(body.success());
        assertEquals("Validation failed", body.message());
        assertEquals("VALIDATION_ERROR", body.error().code());
        assertNotNull(body.error().validations());
        assertEquals(1, body.error().validations().size());
        assertEquals("email", body.error().validations().get(0).field());
        assertEquals("Email must be valid", body.error().validations().get(0).message());
    }

    @Test
    void shouldHandleEntityNotFoundException() {
        EntityNotFoundException ex = new EntityNotFoundException("Candidate", UUID.randomUUID());

        ResponseEntity<BaseResponse<Void>> response = handler.handleEntityNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().success());
        assertEquals("NOT_FOUND", response.getBody().error().code());
    }

    @Test
    void shouldHandleIllegalArgumentException() {
        IllegalArgumentException ex = new IllegalArgumentException("Invalid input argument");

        ResponseEntity<BaseResponse<Void>> response = handler.handleIllegalArgument(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().success());
        assertEquals("INVALID_ARGUMENT", response.getBody().error().code());
        assertEquals("Invalid input argument", response.getBody().error().message());
    }

    @Test
    void shouldHandleConflictException() {
        ConflictException ex = new ConflictException("Email already in use");

        ResponseEntity<BaseResponse<Void>> response = handler.handleConflictException(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().success());
        assertEquals("CONFLICT", response.getBody().error().code());
        assertEquals("Email already in use", response.getBody().error().message());
    }

    @Test
    void shouldHandleAccessDeniedException() {
        AccessDeniedException ex = new AccessDeniedException("User missing required role");

        ResponseEntity<BaseResponse<Void>> response = handler.handleAccessDeniedException(ex);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().success());
        assertEquals("ACCESS_DENIED", response.getBody().error().code());
        assertEquals("User missing required role", response.getBody().error().message());
    }

    @Test
    void shouldHandleGenericException() {
        Exception ex = new Exception("Unexpected runtime crash");

        ResponseEntity<BaseResponse<Void>> response = handler.handleGenericException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().success());
        assertEquals("INTERNAL_ERROR", response.getBody().error().code());
        assertEquals("Internal server error", response.getBody().message());
    }

    @Test
    void shouldHandleHttpMessageNotReadable() {
        HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);
        WebRequest request = mock(WebRequest.class);
        HttpHeaders headers = new HttpHeaders();

        ResponseEntity<Object> response = handler.handleHttpMessageNotReadable(ex, headers, HttpStatus.BAD_REQUEST,
                request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        BaseResponse<Void> body = (BaseResponse<Void>) response.getBody();
        assertFalse(body.success());
        assertEquals("MALFORMED_JSON", body.error().code());
    }

    @Test
    void shouldHandleHttpRequestMethodNotSupported() {
        org.springframework.web.HttpRequestMethodNotSupportedException ex = new org.springframework.web.HttpRequestMethodNotSupportedException(
                "POST");
        WebRequest request = mock(WebRequest.class);
        HttpHeaders headers = new HttpHeaders();

        ResponseEntity<Object> response = handler.handleHttpRequestMethodNotSupported(ex, headers,
                HttpStatus.METHOD_NOT_ALLOWED, request);

        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        BaseResponse<Void> body = (BaseResponse<Void>) response.getBody();
        assertFalse(body.success());
        assertEquals("METHOD_NOT_ALLOWED", body.error().code());
    }

    @Test
    void shouldHandleTypeMismatch() {
        MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
        when(ex.getName()).thenReturn("id");
        when(ex.getRequiredType()).thenReturn((Class) UUID.class);

        ResponseEntity<BaseResponse<Void>> response = handler.handleTypeMismatch(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().success());
        assertEquals("INVALID_PARAMETER", response.getBody().error().code());
        assertEquals("Parameter 'id' should be of type 'UUID'", response.getBody().message());
    }

    @Test
    void shouldHandleTypeMismatchWhenRequiredTypeIsNull() {
        MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
        when(ex.getName()).thenReturn("id");
        when(ex.getRequiredType()).thenReturn(null);

        ResponseEntity<BaseResponse<Void>> response = handler.handleTypeMismatch(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().success());
        assertEquals("INVALID_PARAMETER", response.getBody().error().code());
        assertEquals("Parameter 'id' should be of type 'unknown'", response.getBody().message());
    }

    @Test
    void shouldHandleDataIntegrityViolation() {
        org.springframework.dao.DataIntegrityViolationException ex = new org.springframework.dao.DataIntegrityViolationException(
                "FK constraint fail");

        ResponseEntity<BaseResponse<Void>> response = handler.handleDataIntegrityViolation(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().success());
        assertEquals("DATA_INTEGRITY_VIOLATION", response.getBody().error().code());
    }
}
