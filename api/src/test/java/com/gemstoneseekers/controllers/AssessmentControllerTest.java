package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.request.AssessmentHistoryFilterParams;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateAssessmentHistoryResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.dtos.response.AssessmentResponse;
import com.gemstoneseekers.dtos.response.AssessmentDetailedResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentResultResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.AssessmentStatus;
import com.gemstoneseekers.services.AssessmentApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TestControllerTest {

    @Mock
    private AssessmentApplicationService assessmentApplicationService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private AssessmentController assessmentController;

    private final String userEmail = "test@example.com";
    private final String technologyName = "Java";
    private final UUID assessmentId = UUID.randomUUID();
    private final Long questionId = 1L;
    private final UUID candidateId = UUID.randomUUID();
    private final Long selectedOptionId = 10L;

    @BeforeEach
    void setUp() {
        when(userDetails.getUsername()).thenReturn(userEmail);
    }

    @Test
    void startAssessment_shouldReturnCreatedStatusAndTestResponse_whenTestStartsSuccessfully() {
        TechnologyResponse technologyResponse = new TechnologyResponse(1, technologyName, "Programming Language");
        AssessmentResponse mockAssessmentResponse = new AssessmentResponse(assessmentId, technologyResponse,
                AssessmentStatus.IN_PROGRESS, Collections.emptyList());
        when(assessmentApplicationService.startAssessment(userEmail, technologyName, QuestionDifficulty.BEGINNER))
                .thenReturn(mockAssessmentResponse);

        ResponseEntity<BaseResponse<AssessmentResponse>> responseEntity = assessmentController.startAssessment(
                userDetails, technologyName, QuestionDifficulty.BEGINNER);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test initiated successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockAssessmentResponse);
        verify(assessmentApplicationService).startAssessment(userEmail, technologyName, QuestionDifficulty.BEGINNER);
    }

    @Test
    void startAssessment_shouldReturnCreatedStatusAndTestResponse_whenTestStartsSuccessfullyWithSpecificDifficulty() {
        TechnologyResponse technologyResponse = new TechnologyResponse(1, technologyName, "Programming Language");
        AssessmentResponse mockAssessmentResponse = new AssessmentResponse(assessmentId, technologyResponse,
                AssessmentStatus.IN_PROGRESS, Collections.emptyList());
        when(assessmentApplicationService.startAssessment(userEmail, technologyName, QuestionDifficulty.ADVANCED))
                .thenReturn(mockAssessmentResponse);

        ResponseEntity<BaseResponse<AssessmentResponse>> responseEntity = assessmentController.startAssessment(
                userDetails, technologyName, QuestionDifficulty.ADVANCED);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test initiated successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockAssessmentResponse);
        verify(assessmentApplicationService).startAssessment(userEmail, technologyName, QuestionDifficulty.ADVANCED);
    }

    @Test
    void saveAnswer_shouldReturnOkStatus_whenAnswerIsSavedSuccessfully() {
        SaveAnswerRequest request = new SaveAnswerRequest(questionId, selectedOptionId);

        ResponseEntity<BaseResponse<Void>> responseEntity = assessmentController.saveAnswer(assessmentId, questionId,
                request, userDetails);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Answer saved successfully");
        assertThat(responseEntity.getBody().result()).isNull();
        verify(assessmentApplicationService).saveCandidateAnswer(assessmentId, questionId, request, userEmail);
    }

    @Test
    void submitAssessment_shouldReturnOkStatusAndTestResultResponse_whenTestIsSubmittedSuccessfully() {
        AssessmentResultResponse mockResultResponse = new AssessmentResultResponse(assessmentId, technologyName,
                AssessmentStatus.COMPLETED, BigDecimal.valueOf(80.0), 10, 8L, Instant.now());
        when(assessmentApplicationService.submitAssessment(assessmentId, userEmail)).thenReturn(mockResultResponse);

        ResponseEntity<BaseResponse<AssessmentResultResponse>> responseEntity = assessmentController.submitAssessment(
                assessmentId, userDetails);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test submitted successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockResultResponse);
        verify(assessmentApplicationService).submitAssessment(assessmentId, userEmail);
    }

    @Test
    void getAssessmentHistory_shouldReturnOkStatusAndHistoryResponse_whenHistoryIsRetrievedSuccessfully() {
        CandidateAssessmentHistoryResponse mockHistoryResponse = new CandidateAssessmentHistoryResponse(candidateId, 0,
                Collections.emptyList());
        AssessmentHistoryFilterParams filters = new AssessmentHistoryFilterParams(null, null);
        when(assessmentApplicationService.getCandidateTestHistory(userEmail, filters)).thenReturn(mockHistoryResponse);

        ResponseEntity<BaseResponse<CandidateAssessmentHistoryResponse>> responseEntity = assessmentController
                .getAssessmentHistory(userDetails, filters);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test history retrieved successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockHistoryResponse);
        verify(assessmentApplicationService).getCandidateTestHistory(userEmail, filters);
    }

    @Test
    void getAssessmentResult_shouldReturnOkStatusAndDetailedResultResponse_whenResultIsRetrievedSuccessfully() {
        AssessmentDetailedResultResponse mockDetailedResultResponse = new AssessmentDetailedResultResponse(assessmentId,
                "Java", AssessmentStatus.COMPLETED, QuestionDifficulty.BEGINNER, BigDecimal.valueOf(80.0), 10, 8,
                Instant.now(), List.of());
        when(assessmentApplicationService.getAssessmentResult(assessmentId, userEmail)).thenReturn(
                mockDetailedResultResponse);

        ResponseEntity<BaseResponse<AssessmentDetailedResultResponse>> responseEntity = assessmentController
                .getAssessmentResult(assessmentId, userDetails);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test result retrieved successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockDetailedResultResponse);
        verify(assessmentApplicationService).getAssessmentResult(assessmentId, userEmail);
    }

    @Test
    void cancelAssessment_shouldReturnOkStatus_whenTestIsCanceledSuccessfully() {
        ResponseEntity<BaseResponse<Void>> responseEntity = assessmentController.cancelAssessment(assessmentId,
                userDetails);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test canceled successfully");
        assertThat(responseEntity.getBody().result()).isNull();
        verify(assessmentApplicationService).cancelAssessment(assessmentId, userEmail);
    }
}
