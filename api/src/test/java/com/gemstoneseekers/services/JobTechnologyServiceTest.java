package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.JobTechnologyRequest;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Job;
import com.gemstoneseekers.models.JobTechnology;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.repositories.JobRepository;
import com.gemstoneseekers.repositories.JobTechnologyRepository;
import com.gemstoneseekers.repositories.TechnologyRepository;
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

class JobTechnologyServiceTest {

    private final JobTechnologyRepository jobTechnologyRepository = mock(JobTechnologyRepository.class);
    private final JobRepository jobRepository = mock(JobRepository.class);
    private final TechnologyRepository technologyRepository = mock(TechnologyRepository.class);
    private final JobTechnologyService jobTechnologyService = new JobTechnologyService(jobTechnologyRepository,
            jobRepository, technologyRepository);

    @Test
    void shouldAddTechnologyToJobSuccessfully() {
        UUID jobId = UUID.randomUUID();
        Integer technologyId = 1;
        JobTechnologyRequest request = new JobTechnologyRequest(technologyId, true);
        Job job = new Job();
        job.setId(jobId);
        Technology technology = new Technology();
        technology.setId(technologyId);
        technology.setName("Java");
        when(jobRepository.findByIdAndDeletedAtIsNull(jobId)).thenReturn(Optional.of(job));
        when(technologyRepository.findById(technologyId)).thenReturn(Optional.of(technology));
        when(jobTechnologyRepository.existsByJobIdAndTechnologyId(jobId, technologyId)).thenReturn(false);
        when(jobTechnologyRepository.save(any(JobTechnology.class))).thenAnswer(invocation -> invocation.getArgument(
                0));

        JobTechnology result = jobTechnologyService.addTechnology(jobId, request);

        assertThat(result).isNotNull();
        assertThat(result.getJob()).isEqualTo(job);
        assertThat(result.getTechnology()).isEqualTo(technology);
        assertThat(result.getIsMandatory()).isTrue();
        verify(jobTechnologyRepository).save(any(JobTechnology.class));
    }

    @Test
    void shouldAddTechnologyWithDefaultMandatoryWhenNull() {
        UUID jobId = UUID.randomUUID();
        Integer technologyId = 1;
        JobTechnologyRequest request = new JobTechnologyRequest(technologyId, null);
        Job job = new Job();
        job.setId(jobId);
        Technology technology = new Technology();
        technology.setId(technologyId);
        when(jobRepository.findByIdAndDeletedAtIsNull(jobId)).thenReturn(Optional.of(job));
        when(technologyRepository.findById(technologyId)).thenReturn(Optional.of(technology));
        when(jobTechnologyRepository.existsByJobIdAndTechnologyId(jobId, technologyId)).thenReturn(false);
        when(jobTechnologyRepository.save(any(JobTechnology.class))).thenAnswer(invocation -> invocation.getArgument(
                0));

        JobTechnology result = jobTechnologyService.addTechnology(jobId, request);

        assertThat(result.getIsMandatory()).isTrue();
        verify(jobTechnologyRepository).save(any(JobTechnology.class));
    }

    @Test
    void shouldAddTechnologyAsOptional() {
        UUID jobId = UUID.randomUUID();
        Integer technologyId = 1;
        JobTechnologyRequest request = new JobTechnologyRequest(technologyId, false);
        Job job = new Job();
        job.setId(jobId);
        Technology technology = new Technology();
        technology.setId(technologyId);
        when(jobRepository.findByIdAndDeletedAtIsNull(jobId)).thenReturn(Optional.of(job));
        when(technologyRepository.findById(technologyId)).thenReturn(Optional.of(technology));
        when(jobTechnologyRepository.existsByJobIdAndTechnologyId(jobId, technologyId)).thenReturn(false);
        when(jobTechnologyRepository.save(any(JobTechnology.class))).thenAnswer(invocation -> invocation.getArgument(
                0));

        JobTechnology result = jobTechnologyService.addTechnology(jobId, request);

        assertThat(result.getIsMandatory()).isFalse();
        verify(jobTechnologyRepository).save(any(JobTechnology.class));
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenJobNotFound() {
        UUID jobId = UUID.randomUUID();
        JobTechnologyRequest request = new JobTechnologyRequest(1, true);
        when(jobRepository.findByIdAndDeletedAtIsNull(jobId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobTechnologyService.addTechnology(jobId, request)).isInstanceOf(
                EntityNotFoundException.class).hasMessageContaining("Job");
        verify(technologyRepository, never()).findById(any());
        verify(jobTechnologyRepository, never()).save(any());
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenTechnologyNotFound() {
        UUID jobId = UUID.randomUUID();
        Integer technologyId = 1;
        JobTechnologyRequest request = new JobTechnologyRequest(technologyId, true);
        Job job = new Job();
        job.setId(jobId);
        when(jobRepository.findByIdAndDeletedAtIsNull(jobId)).thenReturn(Optional.of(job));
        when(technologyRepository.findById(technologyId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobTechnologyService.addTechnology(jobId, request)).isInstanceOf(
                EntityNotFoundException.class).hasMessageContaining("Technology");
        verify(jobTechnologyRepository, never()).save(any());
    }

    @Test
    void shouldThrowConflictExceptionWhenTechnologyAlreadyLinked() {
        UUID jobId = UUID.randomUUID();
        Integer technologyId = 1;
        JobTechnologyRequest request = new JobTechnologyRequest(technologyId, true);
        Job job = new Job();
        job.setId(jobId);
        Technology technology = new Technology();
        technology.setId(technologyId);
        when(jobRepository.findByIdAndDeletedAtIsNull(jobId)).thenReturn(Optional.of(job));
        when(technologyRepository.findById(technologyId)).thenReturn(Optional.of(technology));
        when(jobTechnologyRepository.existsByJobIdAndTechnologyId(jobId, technologyId)).thenReturn(true);

        assertThatThrownBy(() -> jobTechnologyService.addTechnology(jobId, request)).isInstanceOf(
                ConflictException.class).hasMessage("Technology is already linked to this job");
        verify(jobTechnologyRepository, never()).save(any());
    }

    @Test
    void shouldRemoveTechnologyFromJobSuccessfully() {
        UUID jobId = UUID.randomUUID();
        Integer technologyId = 1;
        Job job = new Job();
        job.setId(jobId);
        Technology technology = new Technology();
        technology.setId(technologyId);
        JobTechnology jobTechnology = new JobTechnology(job, technology, true);

        when(jobTechnologyRepository.findByJobIdAndTechnologyId(jobId, technologyId)).thenReturn(Optional.of(
                jobTechnology));

        jobTechnologyService.removeTechnology(jobId, technologyId);

        verify(jobTechnologyRepository).delete(jobTechnology);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenRemovingNonexistentLink() {
        UUID jobId = UUID.randomUUID();
        Integer technologyId = 1;

        when(jobTechnologyRepository.findByJobIdAndTechnologyId(jobId, technologyId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobTechnologyService.removeTechnology(jobId, technologyId)).isInstanceOf(
                EntityNotFoundException.class).hasMessageContaining("JobTechnology");

        verify(jobTechnologyRepository, never()).delete(any());
    }

    @Test
    void shouldFindTechnologiesByJobId() {
        UUID jobId = UUID.randomUUID();
        Job job = new Job();
        job.setId(jobId);
        Technology tech1 = new Technology();
        tech1.setId(1);
        tech1.setName("Java");
        Technology tech2 = new Technology();
        tech2.setId(2);
        tech2.setName("Spring");
        JobTechnology jt1 = new JobTechnology(job, tech1, true);
        JobTechnology jt2 = new JobTechnology(job, tech2, false);
        when(jobTechnologyRepository.findByJobId(jobId)).thenReturn(List.of(jt1, jt2));

        List<JobTechnology> result = jobTechnologyService.findByJobId(jobId);

        assertThat(result).hasSize(2);
        assertThat(result.getFirst().getTechnology().getName()).isEqualTo("Java");
        assertThat(result.getFirst().getIsMandatory()).isTrue();
        assertThat(result.get(1).getTechnology().getName()).isEqualTo("Spring");
        assertThat(result.get(1).getIsMandatory()).isFalse();
    }
}
