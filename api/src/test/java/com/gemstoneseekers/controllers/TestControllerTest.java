package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.request.TestHistoryFilterParams;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateTestHistoryResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.dtos.response.TestDetailedResultResponse;
import com.gemstoneseekers.dtos.response.TestResultResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.services.TestApplicationService;
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
    private TestApplicationService testApplicationService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private TestController testController;

    private final String userEmail = "test@example.com";
    private final String technologyName = "Java";
    private final UUID testId = UUID.randomUUID();
    private final Long questionId = 1L;
    private final UUID candidateId = UUID.randomUUID();
    private final Long selectedOptionId = 10L;

    @BeforeEach
    void setUp() {
        when(userDetails.getUsername()).thenReturn(userEmail);
    }

    @Test
    void startTest_shouldReturnCreatedStatusAndTestResponse_whenTestStartsSuccessfully() {
        TechnologyResponse technologyResponse = new TechnologyResponse(1, technologyName, "Programming Language");
        TestResponse mockTestResponse = new TestResponse(testId, technologyResponse, TestStatus.IN_PROGRESS,
                Collections.emptyList());
        when(testApplicationService.startTest(userEmail, technologyName, QuestionDifficulty.BEGINNER))
                .thenReturn(mockTestResponse);

        ResponseEntity<BaseResponse<TestResponse>> responseEntity = testController.startTest(userDetails,
                technologyName, QuestionDifficulty.BEGINNER);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test initiated successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockTestResponse);
        verify(testApplicationService).startTest(userEmail, technologyName, QuestionDifficulty.BEGINNER);
    }

    @Test
    void startTest_shouldReturnCreatedStatusAndTestResponse_whenTestStartsSuccessfullyWithSpecificDifficulty() {
        TechnologyResponse technologyResponse = new TechnologyResponse(1, technologyName, "Programming Language");
        TestResponse mockTestResponse = new TestResponse(testId, technologyResponse, TestStatus.IN_PROGRESS,
                Collections.emptyList());
        when(testApplicationService.startTest(userEmail, technologyName, QuestionDifficulty.ADVANCED))
                .thenReturn(mockTestResponse);

        ResponseEntity<BaseResponse<TestResponse>> responseEntity = testController.startTest(userDetails,
                technologyName, QuestionDifficulty.ADVANCED);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test initiated successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockTestResponse);
        verify(testApplicationService).startTest(userEmail, technologyName, QuestionDifficulty.ADVANCED);
    }

    @Test
    void saveAnswer_shouldReturnOkStatus_whenAnswerIsSavedSuccessfully() {
        SaveAnswerRequest request = new SaveAnswerRequest(questionId, selectedOptionId);

        ResponseEntity<BaseResponse<Void>> responseEntity = testController.saveAnswer(testId, questionId, request,
                userDetails);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Answer saved successfully");
        assertThat(responseEntity.getBody().result()).isNull();
        verify(testApplicationService).saveCandidateAnswer(testId, questionId, request, userEmail);
    }

    @Test
    void submitTest_shouldReturnOkStatusAndTestResultResponse_whenTestIsSubmittedSuccessfully() {
        TestResultResponse mockResultResponse = new TestResultResponse(testId, technologyName, TestStatus.COMPLETED,
                BigDecimal.valueOf(80.0), 10, 8L, Instant.now());
        when(testApplicationService.submitTest(testId, userEmail)).thenReturn(mockResultResponse);

        ResponseEntity<BaseResponse<TestResultResponse>> responseEntity = testController.submitTest(testId,
                userDetails);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test submitted successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockResultResponse);
        verify(testApplicationService).submitTest(testId, userEmail);
    }

    @Test
    void getTestHistory_shouldReturnOkStatusAndHistoryResponse_whenHistoryIsRetrievedSuccessfully() {
        CandidateTestHistoryResponse mockHistoryResponse = new CandidateTestHistoryResponse(candidateId, 0,
                Collections.emptyList());
        TestHistoryFilterParams filters = new TestHistoryFilterParams(null, null);
        when(testApplicationService.getCandidateTestHistory(userEmail, filters)).thenReturn(mockHistoryResponse);

        ResponseEntity<BaseResponse<CandidateTestHistoryResponse>> responseEntity = testController
                .getTestHistory(userDetails, filters);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test history retrieved successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockHistoryResponse);
        verify(testApplicationService).getCandidateTestHistory(userEmail, filters);
    }

    @Test
    void getTestResult_shouldReturnOkStatusAndDetailedResultResponse_whenResultIsRetrievedSuccessfully() {
        TestDetailedResultResponse mockDetailedResultResponse = new TestDetailedResultResponse(testId, "Java",
                TestStatus.COMPLETED, QuestionDifficulty.BEGINNER, BigDecimal.valueOf(80.0), 10, 8, Instant.now(),
                List.of());
        when(testApplicationService.getTestResult(testId, userEmail)).thenReturn(mockDetailedResultResponse);

        ResponseEntity<BaseResponse<TestDetailedResultResponse>> responseEntity = testController.getTestResult(testId,
                userDetails);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test result retrieved successfully");
        assertThat(responseEntity.getBody().result()).isEqualTo(mockDetailedResultResponse);
        verify(testApplicationService).getTestResult(testId, userEmail);
    }

    @Test
    void cancelTest_shouldReturnOkStatus_whenTestIsCanceledSuccessfully() {
        ResponseEntity<BaseResponse<Void>> responseEntity = testController.cancelTest(testId, userDetails);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().success()).isTrue();
        assertThat(responseEntity.getBody().message()).isEqualTo("Test canceled successfully");
        assertThat(responseEntity.getBody().result()).isNull();
        verify(testApplicationService).cancelTest(testId, userEmail);
    }
}
