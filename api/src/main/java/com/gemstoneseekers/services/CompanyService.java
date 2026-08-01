package com.gemstoneseekers.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.request.CompanyRequest;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.repositories.CompanyRepository;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company create(CompanyRequest request) {
        if (request.cnpj() != null && !request.cnpj().isBlank()) {
            if (companyRepository.existsByCnpjAndDeletedAtIsNull(request.cnpj())) {
                throw new ConflictException("CNPJ already in use");
            }
        }
        Company company = new Company();
        company.setName(request.name());
        company.setCnpj(request.cnpj());
        return companyRepository.save(company);
    }

    public List<Company> findAll() {
        return companyRepository.findByDeletedAtIsNull();
    }

    public Company findById(UUID id) {
        return companyRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new EntityNotFoundException("Company", id));
    }

    public Company update(UUID id, CompanyRequest request) {
        Company company = findById(id);
        if (request.cnpj() != null && !request.cnpj().isBlank()) {
            if (!request.cnpj().equals(company.getCnpj())
                && companyRepository.existsByCnpjAndDeletedAtIsNull(request.cnpj())) {
                throw new ConflictException("CNPJ already in use");
            }
            company.setCnpj(request.cnpj());
        }
        company.setName(request.name());
        return companyRepository.save(company);
    }

    public void delete(UUID id) {
        Company company = findById(id);
        company.setDeletedAt(Instant.now());
        companyRepository.save(company);
    }
}
