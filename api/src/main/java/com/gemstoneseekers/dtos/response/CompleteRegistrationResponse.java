package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.UserRole;

import java.util.UUID;

public record CompleteRegistrationResponse(UUID id, String name, String email, UserRole role, String documentType,
        String documentNumber) {
}
