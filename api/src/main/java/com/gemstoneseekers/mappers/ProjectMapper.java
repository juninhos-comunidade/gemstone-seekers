package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.ProjectResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.models.Project;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {
    TechnologyMapper technologyMapper;
    public ProjectResponse toResponse(Project project) {
        if (project == null) {
            return null;
        }
        return new ProjectResponse(
            project.getId(),
            project.getName(),
            project.getDescription(),
            project.getProjectUrl(),
            project.getStartDate(),
            project.getEndDate(),
            technologyMapper.toTechnologyResponseSet(project.getTechnologies())
        );
    }


    public List<ProjectResponse> toResponseList(List<Project> projects) {
        if (projects == null) {
            return List.of();
        }
        return projects.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
}
