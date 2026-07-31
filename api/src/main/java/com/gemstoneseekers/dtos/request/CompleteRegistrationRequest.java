package com.gemstoneseekers.dtos.request;

import com.gemstoneseekers.enums.UserRole;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CompleteRegistrationRequest(
    @NotNull UserRole role,
    String documentType,
    String documentNumber,
    String phone,
    String summary,
    UUID companyId,
    String department
) {}
