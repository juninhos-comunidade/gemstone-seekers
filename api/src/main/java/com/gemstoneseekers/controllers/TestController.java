package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.services.TestApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tests")
public class TestController {


    private final TestApplicationService testApplicationService;

    public TestController(TestApplicationService testApplicationService) {
        this.testApplicationService = testApplicationService;
    }

    @PostMapping("/{technology}")
    public ResponseEntity<BaseResponse<TestResponse>> startTest(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable String technology
    ){
        String email = userDetails.getUsername();

        TestResponse testResponse = testApplicationService.startTest(email, technology);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new BaseResponse<>(
            true,
            "Test initiated successfully",
            testResponse,
            null));
    }



}
