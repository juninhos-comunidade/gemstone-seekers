package com.gemstoneseekers.dtos.response;

import java.time.LocalDate;
import java.util.UUID;

public record CertificationResponse(
    UUID id,
    String name,
    String issuingOrganization,
    LocalDate issueDate,
    LocalDate expirationDate,
    String credentialUrl
) {}
