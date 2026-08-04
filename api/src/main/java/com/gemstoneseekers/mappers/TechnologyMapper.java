package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.models.Technology;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TechnologyMapper {
    public TechnologyResponse toTechnologyResponse(Technology technology) {
        return new TechnologyResponse(technology.getId(), technology.getName(), technology.getCategory());
    }
    public Set<TechnologyResponse> toTechnologyResponseSet(Set<Technology> technologies) {
        if (technologies == null) {
            return Set.of();
        }
        return technologies.stream()
            .map(this::toTechnologyResponse)
            .collect(Collectors.toSet());
    }
}
