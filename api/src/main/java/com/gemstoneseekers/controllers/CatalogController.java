package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.services.CatalogService;

@RestController
@RequestMapping("/api/v1")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/technologies")
    public ResponseEntity<BaseResponse<List<TechnologyResponse>>> getTechnologies() {
        List<TechnologyResponse> technologies = catalogService.getTechnologies();
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "Technologies retrieved successfully", technologies, null));
    }
}
