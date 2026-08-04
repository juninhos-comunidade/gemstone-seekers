package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.ExperienceResponse;
import com.gemstoneseekers.models.Experience;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExperienceMapper {

    public ExperienceResponse toResponse(Experience experience){
        if(experience == null) return null;
        return new ExperienceResponse(
            experience.getId(),
            experience.getTitle(),
            experience.getCompanyName(),
            experience.getStartDate(),
            experience.getEndDate(),
            experience.getIsCurrent(),
            experience.getDescription()
        );
    }
    public List<ExperienceResponse> toResponseList(List<Experience> experiences){
        if(experiences == null) return List.of();
        return experiences.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
}
