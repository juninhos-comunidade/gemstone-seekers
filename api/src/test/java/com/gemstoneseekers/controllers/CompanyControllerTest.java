package com.gemstoneseekers.controllers;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.gemstoneseekers.dtos.request.CompanyRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CompanyResponse;
import com.gemstoneseekers.mappers.CompanyMapper;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.services.CompanyService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CompanyControllerTest {

    private final CompanyService companyService = mock(CompanyService.class);
    private final CompanyMapper companyMapper = mock(CompanyMapper.class);
    private final CompanyController companyController = new CompanyController(companyService, companyMapper);

    @Test
    void shouldCreateCompanyAndReturnCreatedStatus() {
        CompanyRequest request = new CompanyRequest("Tech Corp", "12345678000190");
        Company company = new Company();
        company.setId(UUID.randomUUID());
        company.setName("Tech Corp");
        company.setCnpj("12345678000190");
        CompanyResponse response = new CompanyResponse(company.getId(), "Tech Corp", "12345678000190");
        when(companyService.create(request)).thenReturn(company);
        when(companyMapper.toCompanyResponse(company)).thenReturn(response);

        ResponseEntity<BaseResponse<CompanyResponse>> result = companyController.create(request);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        BaseResponse<CompanyResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Company created successfully");
        assertThat(body.result().name()).isEqualTo("Tech Corp");
        verify(companyService).create(request);
        verify(companyMapper).toCompanyResponse(company);
    }

    @Test
    void shouldFindAllCompaniesAndReturnOkStatus() {
        Company company1 = new Company();
        company1.setId(UUID.randomUUID());
        company1.setName("Tech Corp");
        Company company2 = new Company();
        company2.setId(UUID.randomUUID());
        company2.setName("Dev Inc");
        CompanyResponse response1 = new CompanyResponse(company1.getId(), "Tech Corp", null);
        CompanyResponse response2 = new CompanyResponse(company2.getId(), "Dev Inc", null);
        when(companyService.findAll()).thenReturn(List.of(company1, company2));
        when(companyMapper.toCompanyResponse(company1)).thenReturn(response1);
        when(companyMapper.toCompanyResponse(company2)).thenReturn(response2);

        ResponseEntity<BaseResponse<List<CompanyResponse>>> result = companyController.findAll();

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<List<CompanyResponse>> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.result()).hasSize(2);
        assertThat(body.result().getFirst().name()).isEqualTo("Tech Corp");
        assertThat(body.result().get(1).name()).isEqualTo("Dev Inc");
        verify(companyService).findAll();
    }

    @Test
    void shouldFindCompanyByIdAndReturnOkStatus() {
        UUID id = UUID.randomUUID();
        Company company = new Company();
        company.setId(id);
        company.setName("Tech Corp");
        CompanyResponse response = new CompanyResponse(id, "Tech Corp", null);
        when(companyService.findById(id)).thenReturn(company);
        when(companyMapper.toCompanyResponse(company)).thenReturn(response);

        ResponseEntity<BaseResponse<CompanyResponse>> result = companyController.findById(id);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<CompanyResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.result().id()).isEqualTo(id);
        assertThat(body.result().name()).isEqualTo("Tech Corp");
        verify(companyService).findById(id);
    }

    @Test
    void shouldUpdateCompanyAndReturnOkStatus() {
        UUID id = UUID.randomUUID();
        CompanyRequest request = new CompanyRequest("New Name", "12345678000190");
        Company company = new Company();
        company.setId(id);
        company.setName("New Name");
        company.setCnpj("12345678000190");
        CompanyResponse response = new CompanyResponse(id, "New Name", "12345678000190");
        when(companyService.update(id, request)).thenReturn(company);
        when(companyMapper.toCompanyResponse(company)).thenReturn(response);

        ResponseEntity<BaseResponse<CompanyResponse>> result = companyController.update(id, request);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<CompanyResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Company updated successfully");
        assertThat(body.result().name()).isEqualTo("New Name");
        verify(companyService).update(id, request);
    }

    @Test
    void shouldDeleteCompanyAndReturnOkStatus() {
        UUID id = UUID.randomUUID();

        ResponseEntity<BaseResponse<Void>> result = companyController.delete(id);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<Void> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Company deleted successfully");
        assertThat(body.result()).isNull();
        verify(companyService).delete(id);
    }
}
