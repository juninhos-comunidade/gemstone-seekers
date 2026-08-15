package com.gemstoneseekers.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.request.CompanyRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CompanyResponse;
import com.gemstoneseekers.mappers.CompanyMapper;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.services.CompanyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final CompanyMapper companyMapper;

    public CompanyController(CompanyService companyService, CompanyMapper companyMapper) {
        this.companyService = companyService;
        this.companyMapper = companyMapper;
    }

    @PostMapping
    public ResponseEntity<BaseResponse<CompanyResponse>> create(@Valid @RequestBody CompanyRequest request) {
        Company company = companyService.create(request);
        CompanyResponse response = companyMapper.toCompanyResponse(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse<>(true, "Company created successfully",
                response, null));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<CompanyResponse>>> findAll() {
        List<Company> companies = companyService.findAll();
        List<CompanyResponse> responses = companies.stream().map(companyMapper::toCompanyResponse).toList();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Companies retrieved successfully",
                responses, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<CompanyResponse>> findById(@PathVariable UUID id) {
        Company company = companyService.findById(id);
        CompanyResponse response = companyMapper.toCompanyResponse(company);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Company retrieved successfully",
                response, null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<CompanyResponse>> update(@PathVariable UUID id,
            @Valid @RequestBody CompanyRequest request) {
        Company company = companyService.update(id, request);
        CompanyResponse response = companyMapper.toCompanyResponse(company);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Company updated successfully",
                response, null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable UUID id) {
        companyService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Company deleted successfully", null,
                null));
    }
}
