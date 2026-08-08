package com.gemstoneseekers.dtos.request;

import java.time.LocalDate;

public record CertificationRequest(String name, String issuingOrganization, LocalDate issueDate,
        LocalDate expirationDate, String credentialUrl) {
}
