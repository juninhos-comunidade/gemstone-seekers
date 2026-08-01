package com.gemstoneseekers.services;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.gemstoneseekers.dtos.request.JobRequest;
import com.gemstoneseekers.enums.JobStatus;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Job;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CompanyRepository;
import com.gemstoneseekers.repositories.JobRepository;
import com.gemstoneseekers.repositories.RecruiterRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class JobServiceTest {

    private final JobRepository jobRepository = mock(JobRepository.class);
    private final RecruiterRepository recruiterRepository = mock(RecruiterRepository.class);
    private final CompanyRepository companyRepository = mock(CompanyRepository.class);
    private final JobService jobService = new JobService(jobRepository, recruiterRepository, companyRepository);

    @Test
    void shouldCreateJobSuccessfully() {
        UUID recruiterId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        JobRequest request = new JobRequest("Java Developer", "Backend role", "Senior", "Engineering",
            new BigDecimal("5000"), new BigDecimal("8000"), recruiterId, companyId);
        Recruiter recruiter = new Recruiter();
        recruiter.setId(recruiterId);
        Company company = new Company();
        company.setId(companyId);
        when(recruiterRepository.findByIdAndDeletedAtIsNull(recruiterId)).thenReturn(Optional.of(recruiter));
        when(companyRepository.findByIdAndDeletedAtIsNull(companyId)).thenReturn(Optional.of(company));
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Job result = jobService.create(request);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Java Developer");
        assertThat(result.getDescription()).isEqualTo("Backend role");
        assertThat(result.getSeniorityLevel()).isEqualTo("Senior");
        assertThat(result.getStatus()).isEqualTo(JobStatus.OPEN);
        assertThat(result.getRecruiter()).isEqualTo(recruiter);
        assertThat(result.getCompany()).isEqualTo(company);
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenRecruiterNotFound() {
        UUID recruiterId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        JobRequest request = new JobRequest("Java Developer", "Backend role", null, null, null, null,
            recruiterId, companyId);
        when(recruiterRepository.findByIdAndDeletedAtIsNull(recruiterId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.create(request))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Recruiter");
        verify(companyRepository, never()).findByIdAndDeletedAtIsNull(any());
        verify(jobRepository, never()).save(any());
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenCompanyNotFound() {
        UUID recruiterId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        JobRequest request = new JobRequest("Java Developer", "Backend role", null, null, null, null,
            recruiterId, companyId);
        Recruiter recruiter = new Recruiter();
        recruiter.setId(recruiterId);
        when(recruiterRepository.findByIdAndDeletedAtIsNull(recruiterId)).thenReturn(Optional.of(recruiter));
        when(companyRepository.findByIdAndDeletedAtIsNull(companyId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.create(request))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Company");
        verify(jobRepository, never()).save(any());
    }

    @Test
    void shouldFindAllActiveJobs() {
        Job job1 = new Job();
        job1.setId(UUID.randomUUID());
        job1.setTitle("Java Developer");
        Job job2 = new Job();
        job2.setId(UUID.randomUUID());
        job2.setTitle("Python Developer");
        when(jobRepository.findByDeletedAtIsNull()).thenReturn(List.of(job1, job2));

        List<Job> result = jobService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.getFirst().getTitle()).isEqualTo("Java Developer");
        assertThat(result.get(1).getTitle()).isEqualTo("Python Developer");
    }

    @Test
    void shouldFindJobById() {
        UUID id = UUID.randomUUID();
        Job job = new Job();
        job.setId(id);
        job.setTitle("Java Developer");
        when(jobRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(job));

        Job result = jobService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getTitle()).isEqualTo("Java Developer");
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenJobNotFound() {
        UUID id = UUID.randomUUID();
        when(jobRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.findById(id))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Job");
    }

    @Test
    void shouldUpdateJobSuccessfully() {
        UUID id = UUID.randomUUID();
        Job existing = new Job();
        existing.setId(id);
        existing.setTitle("Old Title");
        existing.setDescription("Old Description");
        JobRequest request = new JobRequest("New Title", "New Description", "Senior", "Engineering",
            new BigDecimal("5000"), new BigDecimal("8000"), UUID.randomUUID(), UUID.randomUUID());
        when(jobRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(existing));
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Job result = jobService.update(id, request);

        assertThat(result.getTitle()).isEqualTo("New Title");
        assertThat(result.getDescription()).isEqualTo("New Description");
        assertThat(result.getSeniorityLevel()).isEqualTo("Senior");
        assertThat(result.getDepartment()).isEqualTo("Engineering");
        verify(jobRepository).save(existing);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenUpdatingNonexistentJob() {
        UUID id = UUID.randomUUID();
        JobRequest request = new JobRequest("Title", "Description", null, null, null, null,
            UUID.randomUUID(), UUID.randomUUID());
        when(jobRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.update(id, request))
            .isInstanceOf(EntityNotFoundException.class);
        verify(jobRepository, never()).save(any());
    }

    @Test
    void shouldDeleteJobBySettingDeletedAt() {
        UUID id = UUID.randomUUID();
        Job existing = new Job();
        existing.setId(id);
        existing.setTitle("Java Developer");
        when(jobRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(existing));
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        jobService.delete(id);

        assertThat(existing.getDeletedAt()).isNotNull();
        verify(jobRepository).save(existing);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenDeletingNonexistentJob() {
        UUID id = UUID.randomUUID();
        when(jobRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.delete(id))
            .isInstanceOf(EntityNotFoundException.class);
        verify(jobRepository, never()).save(any());
    }
}
