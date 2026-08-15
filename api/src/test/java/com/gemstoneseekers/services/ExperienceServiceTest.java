package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.ExperienceRequest;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.ExperienceMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Experience;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.ExperienceRepository;
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
class ExperienceServiceTest {

    @Mock
    private ExperienceRepository experienceRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private ExperienceMapper experienceMapper;

    @InjectMocks
    private ExperienceService experienceService;

    @Test
    void shouldAddExperienceWhenCandidateExists() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();
        UUID experienceId = UUID.randomUUID();

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setExperiences(new ArrayList<>());

        ExperienceRequest request = new ExperienceRequest("Software Engineer", "Tech Corp", LocalDate.of(2020, 1, 1),
                LocalDate.of(2023, 12, 31), false, "Developed web applications");

        Experience newExperience = new Experience();
        newExperience.setId(experienceId);
        newExperience.setCandidate(candidate);
        newExperience.setTitle("Software Engineer");
        newExperience.setCompanyName("Tech Corp");

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(experienceMapper.toExperience(request, candidate)).thenReturn(newExperience);
        when(experienceRepository.save(newExperience)).thenReturn(newExperience);

        experienceService.addExperience(email, request);

        assertThat(candidate.getExperiences()).contains(newExperience);
        verify(candidateRepository).findByUserEmail(email);
        verify(experienceMapper).toExperience(request, candidate);
        verify(experienceRepository).save(newExperience);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenAddExperienceWithNonExistentCandidate() {
        String email = "nonexistent@example.com";
        ExperienceRequest request = new ExperienceRequest("Software Engineer", "Tech Corp", LocalDate.of(2020, 1, 1),
                LocalDate.of(2023, 12, 31), false, "Developed web applications");

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> experienceService.addExperience(email, request)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Candidate with id " + email + " not found");

        verify(candidateRepository).findByUserEmail(email);
        verify(experienceMapper, never()).toExperience(any(), any());
        verify(experienceRepository, never()).save(any());
    }

    @Test
    void shouldDeleteExperienceWhenCandidateIsOwner() {
        UUID experienceId = UUID.randomUUID();
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(email);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setExperiences(new ArrayList<>());

        Experience experience = new Experience();
        experience.setId(experienceId);
        experience.setCandidate(candidate);

        candidate.getExperiences().add(experience);

        when(experienceRepository.findById(experienceId)).thenReturn(Optional.of(experience));

        experienceService.deleteExperience(email, experienceId);

        assertThat(candidate.getExperiences()).doesNotContain(experience);
        verify(experienceRepository).findById(experienceId);
        verify(experienceRepository).delete(experience);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenDeleteExperienceNotFound() {
        UUID experienceId = UUID.randomUUID();
        String email = "candidate@example.com";

        when(experienceRepository.findById(experienceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> experienceService.deleteExperience(email, experienceId)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Link with id " + experienceId + " not found");

        verify(experienceRepository).findById(experienceId);
        verify(experienceRepository, never()).delete(any());
    }

    @Test
    void shouldThrowAccessDeniedExceptionWhenDeleteExperienceFromDifferentOwner() {
        UUID experienceId = UUID.randomUUID();
        String ownerEmail = "owner@example.com";
        String requesterEmail = "other@example.com";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(ownerEmail);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);

        Experience experience = new Experience();
        experience.setId(experienceId);
        experience.setCandidate(candidate);

        when(experienceRepository.findById(experienceId)).thenReturn(Optional.of(experience));

        assertThatThrownBy(() -> experienceService.deleteExperience(requesterEmail, experienceId)).isInstanceOf(
                AccessDeniedException.class).hasMessage("Operação inválida. Você não é o proprietário deste registro.");

        verify(experienceRepository).findById(experienceId);
        verify(experienceRepository, never()).delete(any());
    }

    @Test
    void shouldHandleCaseInsensitiveEmailComparisonWhenDeleting() {
        UUID experienceId = UUID.randomUUID();
        String emailLowerCase = "candidate@example.com";
        String emailUpperCase = "CANDIDATE@EXAMPLE.COM";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(emailLowerCase);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setExperiences(new ArrayList<>());

        Experience experience = new Experience();
        experience.setId(experienceId);
        experience.setCandidate(candidate);

        candidate.getExperiences().add(experience);

        when(experienceRepository.findById(experienceId)).thenReturn(Optional.of(experience));

        experienceService.deleteExperience(emailUpperCase, experienceId);

        assertThat(candidate.getExperiences()).doesNotContain(experience);
        verify(experienceRepository).findById(experienceId);
        verify(experienceRepository).delete(experience);
    }

}
