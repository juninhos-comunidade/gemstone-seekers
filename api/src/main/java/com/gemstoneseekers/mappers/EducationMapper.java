package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.request.EducationRequest;
import com.gemstoneseekers.dtos.response.EducationResponse;
import com.gemstoneseekers.models.Candidate;
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

    public EducationResponse toResponse(Education education) {
        if (education == null) {
            return null;
        }
        return new EducationResponse(education.getId(), education.getInstitution(), education.getFieldOfStudy(),
                education.getDegree(), education.getStartDate(), education.getCompletionDate());
    }
    public List<EducationResponse> toResponseList(List<Education> educations) {
        if (educations == null) {
            return List.of();
        }
        return educations.stream().map(this::toResponse).collect(Collectors.toList());
    }
    public Education toEducation(EducationRequest request, Candidate candidate) {
        Education newEducation = new Education();
        if (request == null || candidate == null) {
            return null;
        }

        newEducation.setCandidate(candidate);
        newEducation.setStartDate(request.startDate());
        newEducation.setInstitution(request.institution());
        newEducation.setFieldOfStudy(request.fieldOfStudy());
        newEducation.setDegree(request.degree());
        newEducation.setCompletionDate(request.completionDate());
        return newEducation;

    }
}
