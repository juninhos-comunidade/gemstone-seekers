package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.CompanyResponse;
import com.gemstoneseekers.models.Company;

@Component
public class CompanyMapper {

    public CompanyResponse toCompanyResponse(Company company) {
        return new CompanyResponse(company.getId(), company.getName(), company.getCnpj());
    }
}
