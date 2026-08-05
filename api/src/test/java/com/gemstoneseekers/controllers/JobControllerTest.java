package com.gemstoneseekers.controllers;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.gemstoneseekers.dtos.request.JobRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.JobResponse;
import com.gemstoneseekers.enums.JobStatus;
import com.gemstoneseekers.mappers.JobMapper;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Job;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.services.JobService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class JobControllerTest {

    private final JobService jobService = mock(JobService.class);
    private final JobMapper jobMapper = mock(JobMapper.class);
    private final JobController jobController = new JobController(jobService, jobMapper);

    @Test
    void shouldCreateJobAndReturnCreatedStatus() {
        UUID recruiterId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID jobId = UUID.randomUUID();
        JobRequest request = new JobRequest("Java Developer", "Backend role", "Senior", "Engineering",
                new BigDecimal("5000"), new BigDecimal("8000"), recruiterId, companyId);
        Recruiter recruiter = new Recruiter();
        recruiter.setId(recruiterId);
        Company company = new Company();
        company.setId(companyId);
        Job job = new Job();
        job.setId(jobId);
        job.setTitle("Java Developer");
        job.setDescription("Backend role");
        job.setRecruiter(recruiter);
        job.setCompany(company);
        JobResponse response = new JobResponse(jobId, "Java Developer", "Backend role", "Senior", "Engineering",
                new BigDecimal("5000"), new BigDecimal("8000"), JobStatus.OPEN, recruiterId, companyId);
        when(jobService.create(request)).thenReturn(job);
        when(jobMapper.toJobResponse(job)).thenReturn(response);

        ResponseEntity<BaseResponse<JobResponse>> result = jobController.create(request);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        BaseResponse<JobResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Job created successfully");
        assertThat(body.result().title()).isEqualTo("Java Developer");
        assertThat(body.result().status()).isEqualTo(JobStatus.OPEN);
        verify(jobService).create(request);
        verify(jobMapper).toJobResponse(job);
    }

    @Test
    void shouldFindAllJobsAndReturnOkStatus() {
        Job job1 = new Job();
        job1.setId(UUID.randomUUID());
        job1.setTitle("Java Developer");
        Job job2 = new Job();
        job2.setId(UUID.randomUUID());
        job2.setTitle("Python Developer");
        JobResponse response1 = new JobResponse(job1.getId(), "Java Developer", "Backend", null, null, null, null,
                JobStatus.OPEN, UUID.randomUUID(), UUID.randomUUID());
        JobResponse response2 = new JobResponse(job2.getId(), "Python Developer", "Backend", null, null, null, null,
                JobStatus.OPEN, UUID.randomUUID(), UUID.randomUUID());
        when(jobService.findAll()).thenReturn(List.of(job1, job2));
        when(jobMapper.toJobResponse(job1)).thenReturn(response1);
        when(jobMapper.toJobResponse(job2)).thenReturn(response2);

        ResponseEntity<BaseResponse<List<JobResponse>>> result = jobController.findAll();

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<List<JobResponse>> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.result()).hasSize(2);
        assertThat(body.result().getFirst().title()).isEqualTo("Java Developer");
        assertThat(body.result().get(1).title()).isEqualTo("Python Developer");
        verify(jobService).findAll();
    }

    @Test
    void shouldFindJobByIdAndReturnOkStatus() {
        UUID id = UUID.randomUUID();
        Job job = new Job();
        job.setId(id);
        job.setTitle("Java Developer");
        JobResponse response = new JobResponse(id, "Java Developer", "Backend role", "Senior", "Engineering", null,
                null, JobStatus.OPEN, UUID.randomUUID(), UUID.randomUUID());
        when(jobService.findById(id)).thenReturn(job);
        when(jobMapper.toJobResponse(job)).thenReturn(response);

        ResponseEntity<BaseResponse<JobResponse>> result = jobController.findById(id);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<JobResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.result().id()).isEqualTo(id);
        assertThat(body.result().title()).isEqualTo("Java Developer");
        verify(jobService).findById(id);
    }

    @Test
    void shouldUpdateJobAndReturnOkStatus() {
        UUID id = UUID.randomUUID();
        JobRequest request = new JobRequest("Senior Java Dev", "Updated description", "Senior", "Engineering",
                new BigDecimal("6000"), new BigDecimal("9000"), UUID.randomUUID(), UUID.randomUUID());
        Job job = new Job();
        job.setId(id);
        job.setTitle("Senior Java Dev");
        JobResponse response = new JobResponse(id, "Senior Java Dev", "Updated description", "Senior", "Engineering",
                new BigDecimal("6000"), new BigDecimal("9000"), JobStatus.OPEN, UUID.randomUUID(), UUID.randomUUID());
        when(jobService.update(id, request)).thenReturn(job);
        when(jobMapper.toJobResponse(job)).thenReturn(response);

        ResponseEntity<BaseResponse<JobResponse>> result = jobController.update(id, request);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<JobResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Job updated successfully");
        assertThat(body.result().title()).isEqualTo("Senior Java Dev");
        verify(jobService).update(id, request);
    }

    @Test
    void shouldDeleteJobAndReturnOkStatus() {
        UUID id = UUID.randomUUID();

        ResponseEntity<BaseResponse<Void>> result = jobController.delete(id);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<Void> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Job deleted successfully");
        assertThat(body.result()).isNull();
        verify(jobService).delete(id);
    }
}
