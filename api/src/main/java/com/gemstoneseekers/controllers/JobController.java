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

import com.gemstoneseekers.dtos.request.JobRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.JobResponse;
import com.gemstoneseekers.mappers.JobMapper;
import com.gemstoneseekers.models.Job;
import com.gemstoneseekers.services.JobService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobService jobService;
    private final JobMapper jobMapper;

    public JobController(JobService jobService, JobMapper jobMapper) {
        this.jobService = jobService;
        this.jobMapper = jobMapper;
    }

    @PostMapping
    public ResponseEntity<BaseResponse<JobResponse>> create(@Valid @RequestBody JobRequest request) {
        Job job = jobService.create(request);
        JobResponse response = jobMapper.toJobResponse(job);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new BaseResponse<>(true, "Job created successfully", response, null));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<JobResponse>>> findAll() {
        List<Job> jobs = jobService.findAll();
        List<JobResponse> responses = jobs.stream().map(jobMapper::toJobResponse).toList();
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Jobs retrieved successfully", responses, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<JobResponse>> findById(@PathVariable UUID id) {
        Job job = jobService.findById(id);
        JobResponse response = jobMapper.toJobResponse(job);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Job retrieved successfully", response, null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<JobResponse>> update(@PathVariable UUID id,
            @Valid @RequestBody JobRequest request) {
        Job job = jobService.update(id, request);
        JobResponse response = jobMapper.toJobResponse(job);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Job updated successfully", response, null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable UUID id) {
        jobService.delete(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Job deleted successfully", null, null));
    }
}
