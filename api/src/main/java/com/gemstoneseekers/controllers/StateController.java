package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.StateResponse;
import com.gemstoneseekers.services.StateService;

@RestController
@RequestMapping("/api/v1/states")
public class StateController {

    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<StateResponse>>> getStates() {
        List<StateResponse> states = stateService.getStates();
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "States retrieved successfully", states, null));
    }
}
