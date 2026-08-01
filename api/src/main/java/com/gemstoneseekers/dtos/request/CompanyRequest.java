package com.gemstoneseekers.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record CompanyRequest(@NotBlank String name, String cnpj) {
}
