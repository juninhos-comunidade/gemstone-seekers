package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.dtos.response.TestResultResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.services.TestApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tests")
public class TestController {


    private final TestApplicationService testApplicationService;

    public TestController(TestApplicationService testApplicationService) {
        this.testApplicationService = testApplicationService;
    }
    @PostMapping("/start/{technology}")
    public ResponseEntity<BaseResponse<TestResponse>> startTest(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable String technology,
        @RequestParam(defaultValue = "BEGINNER") QuestionDifficulty difficulty
    ) {
        String email = userDetails.getUsername();

        TestResponse testResponse = testApplicationService.startTest(email, technology, difficulty);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new BaseResponse<>(true, "Test initiated successfully", testResponse, null));
    }

    @GetMapping("/{technology}/active")
    public ResponseEntity<BaseResponse<TestResponse>> getTestStatus(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable String technology
    ){
        String email = userDetails.getUsername();

        TestResponse testResponse = testApplicationService.getActiveTestAndQuestions(email, technology);

        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(
                true,
                "Active test retrieved successfully",
                testResponse,
                null));
    }

    @PutMapping("/{testId}/answers/{questionId}")
    public ResponseEntity<BaseResponse<Void>> saveAnswer(
        @PathVariable UUID testId,
        @PathVariable Long questionId,
        @Valid @RequestBody SaveAnswerRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();

        testApplicationService.saveCandidateAnswer(testId, questionId, request, email);
        return ResponseEntity.ok(new BaseResponse<>(true, "Answer saved successfully", null, null));
    }
    @PostMapping("/{testId}/submit")
    public ResponseEntity<BaseResponse<TestResultResponse>> submitTest(
        @PathVariable UUID testId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();

        TestResultResponse response = testApplicationService.submitTest(testId, email);

        return ResponseEntity.ok(new BaseResponse<>(true, "Test submitted successfully", response, null));
    }

}
