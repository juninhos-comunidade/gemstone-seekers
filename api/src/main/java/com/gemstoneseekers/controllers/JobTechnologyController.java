package com.gemstoneseekers.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.request.JobTechnologyRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.JobTechnologyResponse;
import com.gemstoneseekers.mappers.JobTechnologyMapper;
import com.gemstoneseekers.models.JobTechnology;
import com.gemstoneseekers.services.JobTechnologyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/jobs/{jobId}/technologies")
public class JobTechnologyController {

    private final JobTechnologyService jobTechnologyService;
    private final JobTechnologyMapper jobTechnologyMapper;

    public JobTechnologyController(JobTechnologyService jobTechnologyService, JobTechnologyMapper jobTechnologyMapper) {
        this.jobTechnologyService = jobTechnologyService;
        this.jobTechnologyMapper = jobTechnologyMapper;
    }

    @PostMapping
    public ResponseEntity<BaseResponse<JobTechnologyResponse>> addTechnology(@PathVariable UUID jobId,
            @Valid @RequestBody JobTechnologyRequest request) {
        JobTechnology jobTechnology = jobTechnologyService.addTechnology(jobId, request);
        JobTechnologyResponse response = jobTechnologyMapper.toJobTechnologyResponse(jobTechnology);
        return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse<>(true,
                "Technology linked to job successfully", response, null));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<JobTechnologyResponse>>> findByJobId(@PathVariable UUID jobId) {
        List<JobTechnology> jobTechnologies = jobTechnologyService.findByJobId(jobId);
        List<JobTechnologyResponse> responses = jobTechnologies.stream().map(
                jobTechnologyMapper::toJobTechnologyResponse).toList();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true,
                "Job technologies retrieved successfully", responses, null));
    }

    @DeleteMapping("/{technologyId}")
    public ResponseEntity<BaseResponse<Void>> removeTechnology(@PathVariable UUID jobId,
            @PathVariable Integer technologyId) {
        jobTechnologyService.removeTechnology(jobId, technologyId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true,
                "Technology unlinked from job successfully", null, null));
    }
}
