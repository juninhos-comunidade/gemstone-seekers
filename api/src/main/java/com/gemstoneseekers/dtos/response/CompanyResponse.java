package com.gemstoneseekers.dtos.response;

import java.util.UUID;

public record CompanyResponse(UUID id, String name, String cnpj) {
}
