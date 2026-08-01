package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.services.TechnologyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/technologies")
public class TechnologyController {

    private final TechnologyService technologyService;

    public TechnologyController(TechnologyService technologyService) {
        this.technologyService = technologyService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<TechnologyResponse>>> getTechnologies() {
        List<TechnologyResponse> technologies = technologyService.getTechnologies();
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Technologies retrieved successfully", technologies, null));
    }
}
