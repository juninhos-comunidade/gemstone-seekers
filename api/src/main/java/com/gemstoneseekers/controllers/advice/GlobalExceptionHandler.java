package com.gemstoneseekers.controllers.advice;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.ErrorResponse;
import com.gemstoneseekers.dtos.response.ValidationError;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            @NonNull HttpHeaders headers, @NonNull HttpStatusCode status, @NonNull WebRequest request) {
        List<ValidationError> validationErrors = new ArrayList<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            validationErrors.add(new ValidationError(fieldError.getField(), fieldError.getDefaultMessage()));
        }
        ErrorResponse error = new ErrorResponse("VALIDATION_ERROR", "Validation failed", validationErrors);
        BaseResponse<Void> response = new BaseResponse<>(false, "Validation failed", null, error);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<BaseResponse<Void>> handleEntityNotFound(EntityNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("NOT_FOUND", ex.getMessage(), null);
        BaseResponse<Void> response = new BaseResponse<>(false, ex.getMessage(), null, error);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BaseResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse("INVALID_ARGUMENT", ex.getMessage(), null);
        BaseResponse<Void> response = new BaseResponse<>(false, ex.getMessage(), null, error);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<BaseResponse<Void>> handleConflictException(ConflictException ex) {
        ErrorResponse error = new ErrorResponse("CONFLICT", ex.getMessage(), null);
        BaseResponse<Void> response = new BaseResponse<>(false, ex.getMessage(), null, error);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<BaseResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorResponse error = new ErrorResponse("ACCESS_DENIED", ex.getMessage(), null);
        BaseResponse<Void> response = new BaseResponse<>(false, ex.getMessage(), null, error);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Void>> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred", null);
        BaseResponse<Void> response = new BaseResponse<>(false, "Internal server error", null, error);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            org.springframework.http.converter.HttpMessageNotReadableException ex, @NonNull HttpHeaders headers,
            @NonNull HttpStatusCode status, @NonNull WebRequest request) {
        ErrorResponse error = new ErrorResponse("MALFORMED_JSON", "Malformed JSON payload or invalid field type", null);
        BaseResponse<Void> response = new BaseResponse<>(false, "Invalid request body", null, error);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            org.springframework.web.HttpRequestMethodNotSupportedException ex, @NonNull HttpHeaders headers,
            @NonNull HttpStatusCode status, @NonNull WebRequest request) {
        ErrorResponse error = new ErrorResponse("METHOD_NOT_ALLOWED",
                "HTTP method " + ex.getMethod() + " is not supported for this endpoint", null);
        BaseResponse<Void> response = new BaseResponse<>(false, "Method not allowed", null, error);
        return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    public ResponseEntity<BaseResponse<Void>> handleTypeMismatch(
            org.springframework.web.method.annotation.MethodArgumentTypeMismatchException ex) {
        String name = ex.getName();
        String type = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown";
        String message = String.format("Parameter '%s' should be of type '%s'", name, type);

        ErrorResponse error = new ErrorResponse("INVALID_PARAMETER", message, null);
        BaseResponse<Void> response = new BaseResponse<>(false, message, null, error);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<BaseResponse<Void>> handleDataIntegrityViolation(
            org.springframework.dao.DataIntegrityViolationException ex) {
        ErrorResponse error = new ErrorResponse("DATA_INTEGRITY_VIOLATION", "Database constraint violation occurred",
                null);
        BaseResponse<Void> response = new BaseResponse<>(false, "Data integrity error", null, error);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<BaseResponse<Void>> handleBusinessRuleException(BusinessRuleException ex) {
        ErrorResponse error = new ErrorResponse("BUSINESS_RULE_VIOLATION", ex.getMessage(), null);
        BaseResponse<Void> response = new BaseResponse<>(false, ex.getMessage(), null, error);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
