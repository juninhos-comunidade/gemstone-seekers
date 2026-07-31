package com.gemstoneseekers.dtos.response;

import java.util.UUID;

public record RegisterResponse(UUID id, String name, String email) {
}
