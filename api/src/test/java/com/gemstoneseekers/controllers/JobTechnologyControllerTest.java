package com.gemstoneseekers.controllers;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.gemstoneseekers.dtos.request.JobTechnologyRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.JobTechnologyResponse;
import com.gemstoneseekers.mappers.JobTechnologyMapper;
import com.gemstoneseekers.models.Job;
import com.gemstoneseekers.models.JobTechnology;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.services.JobTechnologyService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class JobTechnologyControllerTest {

    private final JobTechnologyService jobTechnologyService = mock(JobTechnologyService.class);
    private final JobTechnologyMapper jobTechnologyMapper = mock(JobTechnologyMapper.class);
    private final JobTechnologyController jobTechnologyController = new JobTechnologyController(jobTechnologyService,
            jobTechnologyMapper);

    @Test
    void shouldAddTechnologyToJobAndReturnCreatedStatus() {
        UUID jobId = UUID.randomUUID();
        Long technologyId = 1L;
        JobTechnologyRequest request = new JobTechnologyRequest(technologyId, true);
        Job job = new Job();
        job.setId(jobId);
        Technology technology = new Technology();
        technology.setId(technologyId);
        technology.setName("Java");
        JobTechnology jobTechnology = new JobTechnology(job, technology, true);
        JobTechnologyResponse response = new JobTechnologyResponse(technologyId, "Java", "Backend", true);
        when(jobTechnologyService.addTechnology(jobId, request)).thenReturn(jobTechnology);
        when(jobTechnologyMapper.toJobTechnologyResponse(jobTechnology)).thenReturn(response);

        ResponseEntity<BaseResponse<JobTechnologyResponse>> result = jobTechnologyController.addTechnology(jobId,
                request);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        BaseResponse<JobTechnologyResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Technology linked to job successfully");
        assertThat(body.result().technologyId()).isEqualTo(technologyId);
        assertThat(body.result().technologyName()).isEqualTo("Java");
        assertThat(body.result().isMandatory()).isTrue();
        verify(jobTechnologyService).addTechnology(jobId, request);
        verify(jobTechnologyMapper).toJobTechnologyResponse(jobTechnology);
    }

    @Test
    void shouldFindTechnologiesByJobIdAndReturnOkStatus() {
        UUID jobId = UUID.randomUUID();
        Job job = new Job();
        job.setId(jobId);
        Technology tech1 = new Technology();
        tech1.setId(1L);
        tech1.setName("Java");
        Technology tech2 = new Technology();
        tech2.setId(2L);
        tech2.setName("Spring");
        JobTechnology jt1 = new JobTechnology(job, tech1, true);
        JobTechnology jt2 = new JobTechnology(job, tech2, false);
        JobTechnologyResponse response1 = new JobTechnologyResponse(1L, "Java", "Backend", true);
        JobTechnologyResponse response2 = new JobTechnologyResponse(2L, "Spring", "Backend", false);
        when(jobTechnologyService.findByJobId(jobId)).thenReturn(List.of(jt1, jt2));
        when(jobTechnologyMapper.toJobTechnologyResponse(jt1)).thenReturn(response1);
        when(jobTechnologyMapper.toJobTechnologyResponse(jt2)).thenReturn(response2);

        ResponseEntity<BaseResponse<List<JobTechnologyResponse>>> result = jobTechnologyController.findByJobId(jobId);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<List<JobTechnologyResponse>> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.result()).hasSize(2);
        assertThat(body.result().getFirst().technologyName()).isEqualTo("Java");
        assertThat(body.result().getFirst().isMandatory()).isTrue();
        assertThat(body.result().get(1).technologyName()).isEqualTo("Spring");
        assertThat(body.result().get(1).isMandatory()).isFalse();
        verify(jobTechnologyService).findByJobId(jobId);
    }

    @Test
    void shouldRemoveTechnologyFromJobAndReturnOkStatus() {
        UUID jobId = UUID.randomUUID();
        Long technologyId = 1L;

        ResponseEntity<BaseResponse<Void>> result = jobTechnologyController.removeTechnology(jobId, technologyId);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<Void> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Technology unlinked from job successfully");
        assertThat(body.result()).isNull();
        verify(jobTechnologyService).removeTechnology(jobId, technologyId);
    }
}
