package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CityResponse;
import com.gemstoneseekers.dtos.response.StateResponse;
import com.gemstoneseekers.mappers.CityMapper;
import com.gemstoneseekers.mappers.StateMapper;
import com.gemstoneseekers.services.CityService;
import com.gemstoneseekers.services.StateService;

@RestController
@RequestMapping("/api/v1/states")
public class StateController {

    private final StateService stateService;
    private final CityService cityService;
    private final StateMapper stateMapper;
    private final CityMapper cityMapper;

    public StateController(StateService stateService, CityService cityService, StateMapper stateMapper,
            CityMapper cityMapper) {
        this.stateService = stateService;
        this.cityService = cityService;
        this.stateMapper = stateMapper;
        this.cityMapper = cityMapper;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<StateResponse>>> getStates() {
        List<StateResponse> states = stateService.getStates().stream().map(stateMapper::toStateResponse).toList();
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "States retrieved successfully", states, null));
    }

    @GetMapping("/{stateId}/cities")
    public ResponseEntity<BaseResponse<List<CityResponse>>> getCitiesByState(@PathVariable Integer stateId) {
        List<CityResponse> cities = cityService.getCitiesByStateId(stateId).stream().map(cityMapper::toCityResponse)
                .toList();
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Cities retrieved successfully", cities, null));
    }
}
