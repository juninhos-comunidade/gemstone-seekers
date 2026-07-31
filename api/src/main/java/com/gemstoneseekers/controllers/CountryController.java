package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CountryResponse;
import com.gemstoneseekers.services.CountryService;

@RestController
@RequestMapping("/api/v1/countries")
public class CountryController {

    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<CountryResponse>>> getCountries() {
        List<CountryResponse> countries = countryService.getCountries();
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "Countries retrieved successfully", countries, null));
    }
}
