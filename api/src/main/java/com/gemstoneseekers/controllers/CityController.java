package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CityResponse;
import com.gemstoneseekers.services.CityService;

@RestController
@RequestMapping("/api/v1/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<CityResponse>>> getCities() {
        List<CityResponse> cities = cityService.getCities();
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Cities retrieved successfully", cities, null));
    }
}
