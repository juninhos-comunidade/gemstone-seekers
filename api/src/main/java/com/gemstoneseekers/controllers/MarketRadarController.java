package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.TechnologyDemandResponse;
import com.gemstoneseekers.services.MarketRadarService;

@RestController
@RequestMapping("/api/v1/market-radar")
public class MarketRadarController {

    private final MarketRadarService marketRadarService;

    public MarketRadarController(MarketRadarService marketRadarService) {
        this.marketRadarService = marketRadarService;
    }

    @GetMapping("/technology-demand")
    public ResponseEntity<BaseResponse<List<TechnologyDemandResponse>>> getTechnologyDemand() {
        List<TechnologyDemandResponse> result = marketRadarService.getTechnologyDemand();
        return ResponseEntity.ok(
            new BaseResponse<>(true, "Technology demand retrieved successfully", result, null)
        );
    }
}
