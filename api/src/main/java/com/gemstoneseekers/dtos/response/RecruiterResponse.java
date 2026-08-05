package com.gemstoneseekers.dtos.response;

import java.util.UUID;

public record RecruiterResponse(UUID id, UUID userId, UUID companyId, String department) {
}
