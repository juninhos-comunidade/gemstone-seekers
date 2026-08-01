package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.mappers.TechnologyMapper;
import com.gemstoneseekers.services.TechnologyService;

@RestController
@RequestMapping("/api/v1/technologies")
public class TechnologyController {

    private final TechnologyService technologyService;
    private final TechnologyMapper technologyMapper;

    public TechnologyController(TechnologyService technologyService, TechnologyMapper technologyMapper) {
        this.technologyService = technologyService;
        this.technologyMapper = technologyMapper;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<TechnologyResponse>>> getTechnologies() {
        List<TechnologyResponse> technologies = technologyService.getTechnologies().stream()
            .map(technologyMapper::toTechnologyResponse)
            .toList();
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "Technologies retrieved successfully", technologies, null));
    }
}
