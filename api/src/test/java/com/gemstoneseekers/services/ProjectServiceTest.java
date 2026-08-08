package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.ProjectRequest;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.ProjectMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Project;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private ProjectMapper projectMapper;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void shouldAddProjectWhenCandidateExists() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();
        UUID projectId = UUID.randomUUID();

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setProjects(new ArrayList<>());

        ProjectRequest request = new ProjectRequest(
            "E-commerce Platform",
            "Built scalable e-commerce system",
            "https://github.com/user/ecommerce",
            LocalDate.of(2021, 1, 1),
            LocalDate.of(2021, 12, 31)
        );

        Project newProject = new Project();
        newProject.setId(projectId);
        newProject.setCandidate(candidate);
        newProject.setName("E-commerce Platform");
        newProject.setDescription("Built scalable e-commerce system");

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(projectMapper.toProject(request, candidate)).thenReturn(newProject);
        when(candidateRepository.save(candidate)).thenReturn(candidate);

        projectService.addCandidateProject(email, request);

        assertThat(candidate.getProjects()).contains(newProject);
        verify(candidateRepository).findByUserEmail(email);
        verify(projectMapper).toProject(request, candidate);
        verify(candidateRepository).save(candidate);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenAddProjectWithNonExistentCandidate() {
        String email = "nonexistent@example.com";
        ProjectRequest request = new ProjectRequest(
            "E-commerce Platform",
            "Built scalable e-commerce system",
            "https://github.com/user/ecommerce",
            LocalDate.of(2021, 1, 1),
            LocalDate.of(2021, 12, 31)
        );

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.addCandidateProject(email, request))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Candidate with id " + email + " not found");

        verify(candidateRepository).findByUserEmail(email);
        verify(projectMapper, never()).toProject(any(), any());
        verify(candidateRepository, never()).save(any());
    }

    @Test
    void shouldDeleteProjectWhenCandidateIsOwner() {
        UUID projectId = UUID.randomUUID();
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(email);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setProjects(new ArrayList<>());

        Project project = new Project();
        project.setId(projectId);
        project.setCandidate(candidate);

        candidate.getProjects().add(project);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        projectService.deleteCandidateProject(email, projectId);

        assertThat(candidate.getProjects()).doesNotContain(project);
        verify(projectRepository).findById(projectId);
        verify(projectRepository).delete(project);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenDeleteProjectNotFound() {
        UUID projectId = UUID.randomUUID();
        String email = "candidate@example.com";

        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.deleteCandidateProject(email, projectId))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("project with id " + projectId + " not found");

        verify(projectRepository).findById(projectId);
        verify(projectRepository, never()).delete(any());
    }

    @Test
    void shouldThrowAccessDeniedExceptionWhenDeleteProjectFromDifferentOwner() {
        UUID projectId = UUID.randomUUID();
        String ownerEmail = "owner@example.com";
        String requesterEmail = "other@example.com";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(ownerEmail);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);

        Project project = new Project();
        project.setId(projectId);
        project.setCandidate(candidate);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        assertThatThrownBy(() -> projectService.deleteCandidateProject(requesterEmail, projectId))
            .isInstanceOf(AccessDeniedException.class)
            .hasMessage("Operação inválida. Você não é o proprietário deste registro.");

        verify(projectRepository).findById(projectId);
        verify(projectRepository, never()).delete(any());
    }

    @Test
    void shouldHandleCaseInsensitiveEmailComparisonWhenDeleting() {
        UUID projectId = UUID.randomUUID();
        String emailLowerCase = "candidate@example.com";
        String emailUpperCase = "CANDIDATE@EXAMPLE.COM";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(emailLowerCase);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setProjects(new ArrayList<>());

        Project project = new Project();
        project.setId(projectId);
        project.setCandidate(candidate);

        candidate.getProjects().add(project);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        projectService.deleteCandidateProject(emailUpperCase, projectId);

        assertThat(candidate.getProjects()).doesNotContain(project);
        verify(projectRepository).findById(projectId);
        verify(projectRepository).delete(project);
    }

}
