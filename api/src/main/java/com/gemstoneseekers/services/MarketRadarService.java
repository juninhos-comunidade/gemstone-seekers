package com.gemstoneseekers.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.response.TechnologyDemandResponse;
import com.gemstoneseekers.enums.JobStatus;
import com.gemstoneseekers.mappers.MarketRadarMapper;
import com.gemstoneseekers.repositories.JobTechnologyRepository;

@Service
public class MarketRadarService {

    private final JobTechnologyRepository jobTechnologyRepository;
    private final MarketRadarMapper marketRadarMapper;

    public MarketRadarService(JobTechnologyRepository jobTechnologyRepository, MarketRadarMapper marketRadarMapper) {
        this.jobTechnologyRepository = jobTechnologyRepository;
        this.marketRadarMapper = marketRadarMapper;
    }

    public List<TechnologyDemandResponse> getTechnologyDemand() {
        return marketRadarMapper
                .toResponseList(jobTechnologyRepository.findTechnologyDemandByJobStatus(JobStatus.OPEN));
    }
}
