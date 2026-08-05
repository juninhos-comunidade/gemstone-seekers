package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.RecruiterRequest;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CompanyRepository;
import com.gemstoneseekers.repositories.RecruiterRepository;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RecruiterServiceTest {

    private final RecruiterRepository recruiterRepository = mock(RecruiterRepository.class);
    private final CompanyRepository companyRepository = mock(CompanyRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final RecruiterService recruiterService = new RecruiterService(recruiterRepository, companyRepository,
            userRepository);

    @Test
    void shouldLinkRecruiterToCompanySuccessfully() {
        UUID companyId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        RecruiterRequest request = new RecruiterRequest(userId, "Engineering");
        Company company = new Company();
        company.setId(companyId);
        company.setName("Tech Corp");
        User user = new User();
        user.setId(userId);
        user.setName("John Doe");
        when(companyRepository.findByIdAndDeletedAtIsNull(companyId)).thenReturn(Optional.of(company));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(recruiterRepository.existsByUserIdAndDeletedAtIsNull(userId)).thenReturn(false);
        when(recruiterRepository.save(any(Recruiter.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Recruiter result = recruiterService.linkToCompany(companyId, request);

        assertThat(result).isNotNull();
        assertThat(result.getUser()).isEqualTo(user);
        assertThat(result.getCompany()).isEqualTo(company);
        assertThat(result.getDepartment()).isEqualTo("Engineering");
        verify(recruiterRepository).save(any(Recruiter.class));
    }

    @Test
    void shouldLinkRecruiterWithoutDepartment() {
        UUID companyId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        RecruiterRequest request = new RecruiterRequest(userId, null);
        Company company = new Company();
        company.setId(companyId);
        User user = new User();
        user.setId(userId);
        when(companyRepository.findByIdAndDeletedAtIsNull(companyId)).thenReturn(Optional.of(company));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(recruiterRepository.existsByUserIdAndDeletedAtIsNull(userId)).thenReturn(false);
        when(recruiterRepository.save(any(Recruiter.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Recruiter result = recruiterService.linkToCompany(companyId, request);

        assertThat(result.getDepartment()).isNull();
        verify(recruiterRepository).save(any(Recruiter.class));
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenCompanyNotFound() {
        UUID companyId = UUID.randomUUID();
        RecruiterRequest request = new RecruiterRequest(UUID.randomUUID(), "Engineering");
        when(companyRepository.findByIdAndDeletedAtIsNull(companyId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> recruiterService.linkToCompany(companyId, request))
                .isInstanceOf(EntityNotFoundException.class).hasMessageContaining("Company");
        verify(recruiterRepository, never()).save(any());
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenUserNotFound() {
        UUID companyId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        RecruiterRequest request = new RecruiterRequest(userId, "Engineering");
        Company company = new Company();
        company.setId(companyId);
        when(companyRepository.findByIdAndDeletedAtIsNull(companyId)).thenReturn(Optional.of(company));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> recruiterService.linkToCompany(companyId, request))
                .isInstanceOf(EntityNotFoundException.class).hasMessageContaining("User");
        verify(recruiterRepository, never()).save(any());
    }

    @Test
    void shouldThrowConflictExceptionWhenUserAlreadyLinkedAsRecruiter() {
        UUID companyId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        RecruiterRequest request = new RecruiterRequest(userId, "Engineering");
        Company company = new Company();
        company.setId(companyId);
        User user = new User();
        user.setId(userId);
        when(companyRepository.findByIdAndDeletedAtIsNull(companyId)).thenReturn(Optional.of(company));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(recruiterRepository.existsByUserIdAndDeletedAtIsNull(userId)).thenReturn(true);

        assertThatThrownBy(() -> recruiterService.linkToCompany(companyId, request))
                .isInstanceOf(ConflictException.class).hasMessage("User is already linked as a recruiter");
        verify(recruiterRepository, never()).save(any());
    }

    @Test
    void shouldFindRecruitersByCompanyId() {
        UUID companyId = UUID.randomUUID();
        Recruiter recruiter1 = new Recruiter();
        recruiter1.setId(UUID.randomUUID());
        recruiter1.setDepartment("Engineering");
        Recruiter recruiter2 = new Recruiter();
        recruiter2.setId(UUID.randomUUID());
        recruiter2.setDepartment("Marketing");
        when(recruiterRepository.findByCompanyIdAndDeletedAtIsNull(companyId))
                .thenReturn(List.of(recruiter1, recruiter2));

        List<Recruiter> result = recruiterService.findByCompanyId(companyId);

        assertThat(result).hasSize(2);
        assertThat(result.getFirst().getDepartment()).isEqualTo("Engineering");
        assertThat(result.get(1).getDepartment()).isEqualTo("Marketing");
    }

    @Test
    void shouldFindRecruiterById() {
        UUID id = UUID.randomUUID();
        Recruiter recruiter = new Recruiter();
        recruiter.setId(id);
        recruiter.setDepartment("Engineering");
        when(recruiterRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(recruiter));

        Recruiter result = recruiterService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getDepartment()).isEqualTo("Engineering");
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenRecruiterNotFound() {
        UUID id = UUID.randomUUID();
        when(recruiterRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> recruiterService.findById(id)).isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Recruiter");
    }
}
