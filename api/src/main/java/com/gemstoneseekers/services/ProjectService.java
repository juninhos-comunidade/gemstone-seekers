package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.EducationRequest;
import com.gemstoneseekers.dtos.request.ProjectRequest;
import com.gemstoneseekers.dtos.response.ProjectResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.ProjectMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Education;
import com.gemstoneseekers.models.Project;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CandidateRepository candidateRepository;
    private final ProjectMapper projectMapper;


    public ProjectService(ProjectRepository projectRepository, CandidateRepository candidateRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.candidateRepository = candidateRepository;
        this.projectMapper = projectMapper;
    }

    public void addCandidateProject(String email, ProjectRequest request) {


        Candidate candidate = candidateRepository.findByUserEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Candidate", email));

        Project newProject = projectMapper.toProject(request, candidate);
        candidate.getProjects().add(newProject);
        candidateRepository.save(candidate);

    }
    public void deleteCandidateProject(String email, UUID educationId) {

        Project project = projectRepository.findById(educationId)
            .orElseThrow(() -> new EntityNotFoundException("project", educationId));
        Candidate candidate = project.getCandidate();

        if (!candidate.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException(
                "Operação inválida. Você não é o proprietário deste registro."
            );
        }

        candidate.getProjects().remove(project);
        projectRepository.delete(project);
}

}
