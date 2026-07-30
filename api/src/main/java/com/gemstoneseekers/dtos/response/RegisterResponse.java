package com.gemstoneseekers.dtos.response;

import java.util.UUID;

import com.gemstoneseekers.models.UserRole;

public record RegisterResponse(
    UUID id,
    String name,
    String email,
    UserRole role,
    String documentType,
    String documentNumber) {
}
