package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CountryResponse;
import com.gemstoneseekers.dtos.response.StateResponse;
import com.gemstoneseekers.services.CountryService;
import com.gemstoneseekers.services.StateService;

@RestController
@RequestMapping("/api/v1/countries")
public class CountryController {

    private final CountryService countryService;
    private final StateService stateService;

    public CountryController(CountryService countryService, StateService stateService) {
        this.countryService = countryService;
        this.stateService = stateService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<CountryResponse>>> getCountries() {
        List<CountryResponse> countries = countryService.getCountries();
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "Countries retrieved successfully", countries, null));
    }

    @GetMapping("/{countryId}/states")
    public ResponseEntity<BaseResponse<List<StateResponse>>> getStatesByCountry(@PathVariable Integer countryId) {
        List<StateResponse> states = stateService.getStatesByCountryId(countryId);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "States retrieved successfully", states, null));
    }
}
