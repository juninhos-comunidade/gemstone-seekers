package com.gemstoneseekers.dtos.response;

import java.util.UUID;
import com.gemstoneseekers.enums.UserRole;

public record UserResponse(
    UUID id,
    String name,
    String email,
    UserRole role,
    String documentType,
    String documentNumber
) {}
