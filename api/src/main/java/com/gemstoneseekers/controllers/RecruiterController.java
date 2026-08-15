package com.gemstoneseekers.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.request.RecruiterRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.RecruiterResponse;
import com.gemstoneseekers.mappers.RecruiterMapper;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.services.RecruiterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final RecruiterMapper recruiterMapper;

    public RecruiterController(RecruiterService recruiterService, RecruiterMapper recruiterMapper) {
        this.recruiterService = recruiterService;
        this.recruiterMapper = recruiterMapper;
    }

    @PostMapping("/companies/{companyId}/recruiters")
    public ResponseEntity<BaseResponse<RecruiterResponse>> linkToCompany(@PathVariable UUID companyId,
            @Valid @RequestBody RecruiterRequest request) {
        Recruiter recruiter = recruiterService.linkToCompany(companyId, request);
        RecruiterResponse response = recruiterMapper.toRecruiterResponse(recruiter);
        return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse<>(true,
                "Recruiter linked to company successfully", response, null));
    }

    @GetMapping("/companies/{companyId}/recruiters")
    public ResponseEntity<BaseResponse<List<RecruiterResponse>>> findByCompanyId(@PathVariable UUID companyId) {
        List<Recruiter> recruiters = recruiterService.findByCompanyId(companyId);
        List<RecruiterResponse> responses = recruiters.stream().map(recruiterMapper::toRecruiterResponse).toList();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Recruiters retrieved successfully",
                responses, null));
    }

    @GetMapping("/recruiters/{id}")
    public ResponseEntity<BaseResponse<RecruiterResponse>> findById(@PathVariable UUID id) {
        Recruiter recruiter = recruiterService.findById(id);
        RecruiterResponse response = recruiterMapper.toRecruiterResponse(recruiter);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Recruiter retrieved successfully",
                response, null));
    }
}
