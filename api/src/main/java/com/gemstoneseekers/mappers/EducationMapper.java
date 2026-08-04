package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.EducationResponse;
import com.gemstoneseekers.models.Education;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EducationMapper {
    TechnologyMapper technologyMapper;
    public EducationMapper(TechnologyMapper technologyMapper) {
        this.technologyMapper = technologyMapper;
    }

    public EducationResponse toResponse(Education education){
        if (education == null) {
            return null;
        }
        return new EducationResponse(
            education.getId(),
            education.getInstitution(),
            education.getFieldOfStudy(),
            education.getDegree(),
            education.getStartDate(),
            education.getCompletionDate(),
            technologyMapper.toTechnologyResponseSet(education.getTechnologies())
        );
    }
    public List<EducationResponse> toResponseList(List<Education> educations) {
        if (educations == null) {
            return List.of();
        }
        return educations.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
}
