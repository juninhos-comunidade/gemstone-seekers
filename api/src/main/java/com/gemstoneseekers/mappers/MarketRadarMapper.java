package com.gemstoneseekers.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.TechnologyDemandResponse;
import com.gemstoneseekers.repositories.projections.TechnologyDemandProjection;

@Component
public class MarketRadarMapper {

    public TechnologyDemandResponse toResponse(TechnologyDemandProjection projection) {
        return new TechnologyDemandResponse(projection.getTechnologyId(), projection.getTechnologyName(),
                projection.getTechnologyCategory(), projection.getJobCount(), projection.getMandatoryCount());
    }

    public List<TechnologyDemandResponse> toResponseList(List<TechnologyDemandProjection> projections) {
        return projections.stream().map(this::toResponse).toList();
    }
}
