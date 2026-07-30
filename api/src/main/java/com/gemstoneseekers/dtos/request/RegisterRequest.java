package com.gemstoneseekers.dtos.request;

import com.gemstoneseekers.models.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotNull UserRole role,
        String documentType,
        String documentNumber) {
}
