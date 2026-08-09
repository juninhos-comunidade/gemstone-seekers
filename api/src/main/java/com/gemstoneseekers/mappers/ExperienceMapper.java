package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.request.ExperienceRequest;
import com.gemstoneseekers.dtos.response.ExperienceResponse;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Experience;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExperienceMapper {

    public ExperienceResponse toResponse(Experience experience) {
        if (experience == null) {
            return null;
        }
        return new ExperienceResponse(experience.getId(), experience.getTitle(), experience.getCompanyName(),
                experience.getStartDate(), experience.getEndDate(), experience.getIsCurrent(),
                experience.getDescription());
    }
    public List<ExperienceResponse> toResponseList(List<Experience> experiences) {
        if (experiences == null) {
            return List.of();
        }
        return experiences.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Experience toExperience(ExperienceRequest request, Candidate candidate) {
        Experience newExperience = new Experience();
        if (request == null || candidate == null) {
            return null;
        }

        newExperience.setCandidate(candidate);
        newExperience.setTitle(request.title());
        newExperience.setCompanyName(request.companyName());
        newExperience.setDescription(request.description());
        newExperience.setStartDate(request.startDate());
        newExperience.setEndDate(request.endDate());
        newExperience.setIsCurrent(request.isCurrent());

        return newExperience;
    }
}
