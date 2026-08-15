package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.request.AssessmentHistoryFilterParams;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateAssessmentHistoryResponse;
import com.gemstoneseekers.dtos.response.AssessmentDetailedResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentResponse;
import com.gemstoneseekers.dtos.response.AssessmentResultResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.services.AssessmentApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessments")
public class AssessmentController {

    private final AssessmentApplicationService assessmentApplicationService;

    public AssessmentController(AssessmentApplicationService assessmentApplicationService) {
        this.assessmentApplicationService = assessmentApplicationService;
    }
    @PostMapping("/start/{technology}")
    public ResponseEntity<BaseResponse<AssessmentResponse>> startAssessment(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable String technology, @RequestParam(
                    defaultValue = "BEGINNER") QuestionDifficulty difficulty) {
        String email = userDetails.getUsername();

        AssessmentResponse testResponse = assessmentApplicationService.startAssessment(email, technology, difficulty);

        return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse<>(true,
                "Assessment initiated successfully", testResponse, null));
    }

    @PutMapping("/{assessmentId}/answers/{questionId}")
    public ResponseEntity<BaseResponse<Void>> saveAnswer(@PathVariable UUID assessmentId, @PathVariable Long questionId,
            @Valid @RequestBody SaveAnswerRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();

        assessmentApplicationService.saveCandidateAnswer(assessmentId, questionId, request, email);
        return ResponseEntity.ok(new BaseResponse<>(true, "Answer saved successfully", null, null));
    }
    @PostMapping("/{assessmentId}/submit")
    public ResponseEntity<BaseResponse<AssessmentResultResponse>> submitAssessment(@PathVariable UUID assessmentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();

        AssessmentResultResponse response = assessmentApplicationService.submitAssessment(assessmentId, email);

        return ResponseEntity.ok(new BaseResponse<>(true, "Assessment submitted successfully", response, null));
    }
    @GetMapping("/history")
    public ResponseEntity<BaseResponse<CandidateAssessmentHistoryResponse>> getAssessmentHistory(
            @AuthenticationPrincipal UserDetails userDetails, AssessmentHistoryFilterParams filters) {
        String email = userDetails.getUsername();

        CandidateAssessmentHistoryResponse response = assessmentApplicationService.getCandidateTestHistory(email,
                filters);

        return ResponseEntity.ok(new BaseResponse<>(true, "Assessment history retrieved successfully", response, null));
    }

    @GetMapping("/{assessmentId}/result")
    public ResponseEntity<BaseResponse<AssessmentDetailedResultResponse>> getAssessmentResult(
            @PathVariable UUID assessmentId, @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();

        AssessmentDetailedResultResponse response = assessmentApplicationService.getAssessmentResult(assessmentId,
                email);

        return ResponseEntity.ok(new BaseResponse<>(true, "Assessment result retrieved successfully", response, null));
    }

    @PostMapping("/{assessmentId}/cancel")
    public ResponseEntity<BaseResponse<Void>> cancelAssessment(@PathVariable UUID assessmentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();

        assessmentApplicationService.cancelAssessment(assessmentId, email);

        return ResponseEntity.ok(new BaseResponse<>(true, "Assessment canceled successfully", null, null));
    }

}
