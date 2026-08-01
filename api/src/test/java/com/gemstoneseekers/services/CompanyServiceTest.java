package com.gemstoneseekers.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.gemstoneseekers.dtos.request.CompanyRequest;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.repositories.CompanyRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CompanyServiceTest {

    private final CompanyRepository companyRepository = mock(CompanyRepository.class);
    private final CompanyService companyService = new CompanyService(companyRepository);

    @Test
    void shouldCreateCompanySuccessfully() {
        CompanyRequest request = new CompanyRequest("Tech Corp", "12345678000190");
        when(companyRepository.existsByCnpjAndDeletedAtIsNull("12345678000190")).thenReturn(false);
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Company result = companyService.create(request);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Tech Corp");
        assertThat(result.getCnpj()).isEqualTo("12345678000190");
        verify(companyRepository).save(any(Company.class));
    }

    @Test
    void shouldCreateCompanyWithoutCnpj() {
        CompanyRequest request = new CompanyRequest("Tech Corp", null);
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Company result = companyService.create(request);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Tech Corp");
        assertThat(result.getCnpj()).isNull();
        verify(companyRepository, never()).existsByCnpjAndDeletedAtIsNull(any());
    }

    @Test
    void shouldThrowConflictExceptionWhenCnpjAlreadyExists() {
        CompanyRequest request = new CompanyRequest("Tech Corp", "12345678000190");
        when(companyRepository.existsByCnpjAndDeletedAtIsNull("12345678000190")).thenReturn(true);

        assertThatThrownBy(() -> companyService.create(request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("CNPJ already in use");
        verify(companyRepository, never()).save(any());
    }

    @Test
    void shouldFindAllActiveCompanies() {
        Company company1 = new Company();
        company1.setId(UUID.randomUUID());
        company1.setName("Tech Corp");
        Company company2 = new Company();
        company2.setId(UUID.randomUUID());
        company2.setName("Dev Inc");
        when(companyRepository.findByDeletedAtIsNull()).thenReturn(List.of(company1, company2));

        List<Company> result = companyService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Tech Corp");
        assertThat(result.get(1).getName()).isEqualTo("Dev Inc");
    }

    @Test
    void shouldFindCompanyById() {
        UUID id = UUID.randomUUID();
        Company company = new Company();
        company.setId(id);
        company.setName("Tech Corp");
        when(companyRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(company));

        Company result = companyService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getName()).isEqualTo("Tech Corp");
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenCompanyNotFound() {
        UUID id = UUID.randomUUID();
        when(companyRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> companyService.findById(id))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Company");
    }

    @Test
    void shouldUpdateCompanyNameAndCnpj() {
        UUID id = UUID.randomUUID();
        Company existing = new Company();
        existing.setId(id);
        existing.setName("Old Name");
        existing.setCnpj("00000000000000");
        CompanyRequest request = new CompanyRequest("New Name", "12345678000190");
        when(companyRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(existing));
        when(companyRepository.existsByCnpjAndDeletedAtIsNull("12345678000190")).thenReturn(false);
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Company result = companyService.update(id, request);

        assertThat(result.getName()).isEqualTo("New Name");
        assertThat(result.getCnpj()).isEqualTo("12345678000190");
        verify(companyRepository).save(existing);
    }

    @Test
    void shouldUpdateCompanyNameWithoutChangingCnpjWhenCnpjIsSame() {
        UUID id = UUID.randomUUID();
        Company existing = new Company();
        existing.setId(id);
        existing.setName("Old Name");
        existing.setCnpj("12345678000190");
        CompanyRequest request = new CompanyRequest("New Name", "12345678000190");
        when(companyRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(existing));
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Company result = companyService.update(id, request);

        assertThat(result.getName()).isEqualTo("New Name");
        verify(companyRepository, never()).existsByCnpjAndDeletedAtIsNull(any());
    }

    @Test
    void shouldThrowConflictExceptionWhenUpdatingToExistingCnpj() {
        UUID id = UUID.randomUUID();
        Company existing = new Company();
        existing.setId(id);
        existing.setName("Old Name");
        existing.setCnpj("00000000000000");
        CompanyRequest request = new CompanyRequest("New Name", "12345678000190");
        when(companyRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(existing));
        when(companyRepository.existsByCnpjAndDeletedAtIsNull("12345678000190")).thenReturn(true);

        assertThatThrownBy(() -> companyService.update(id, request))
            .isInstanceOf(ConflictException.class)
            .hasMessage("CNPJ already in use");
        verify(companyRepository, never()).save(any());
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenUpdatingNonexistentCompany() {
        UUID id = UUID.randomUUID();
        CompanyRequest request = new CompanyRequest("New Name", null);
        when(companyRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> companyService.update(id, request))
            .isInstanceOf(EntityNotFoundException.class);
        verify(companyRepository, never()).save(any());
    }

    @Test
    void shouldDeleteCompanyBySettingDeletedAt() {
        UUID id = UUID.randomUUID();
        Company existing = new Company();
        existing.setId(id);
        existing.setName("Tech Corp");
        when(companyRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(existing));
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> invocation.getArgument(0));

        companyService.delete(id);

        assertThat(existing.getDeletedAt()).isNotNull();
        verify(companyRepository).save(existing);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenDeletingNonexistentCompany() {
        UUID id = UUID.randomUUID();
        when(companyRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> companyService.delete(id))
            .isInstanceOf(EntityNotFoundException.class);
        verify(companyRepository, never()).save(any());
    }
}
