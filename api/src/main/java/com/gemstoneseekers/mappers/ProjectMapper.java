package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.request.ProjectRequest;
import com.gemstoneseekers.dtos.response.ProjectResponse;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Project;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {
    TechnologyMapper technologyMapper;
    public ProjectResponse toResponse(Project project) {
        if (project == null) {
            return null;
        }
        return new ProjectResponse(project.getId(), project.getName(), project.getDescription(),
                project.getProjectUrl(), project.getStartDate(), project.getEndDate());
    }

    public List<ProjectResponse> toResponseList(List<Project> projects) {
        if (projects == null) {
            return List.of();
        }
        return projects.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Project toProject(ProjectRequest request, Candidate candidate) {
        if (request == null || candidate == null) {
            return null;
        }
        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        project.setProjectUrl(request.projectUrl());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setCandidate(candidate);
        return project;
    }
}
