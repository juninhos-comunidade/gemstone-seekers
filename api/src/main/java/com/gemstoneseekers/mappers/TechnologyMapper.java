package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.models.Technology;

@Component
public class TechnologyMapper {
    public TechnologyResponse toTechnologyResponse(Technology technology) {
        return new TechnologyResponse(technology.getId(), technology.getName(), technology.getCategory());
    }
}
