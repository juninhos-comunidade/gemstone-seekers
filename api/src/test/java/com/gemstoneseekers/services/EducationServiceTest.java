package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.EducationRequest;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.EducationMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Education;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.EducationRepository;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EducationServiceTest {

    @Mock
    private EducationRepository educationRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private EducationMapper educationMapper;

    @InjectMocks
    private EducationService educationService;

    @Test
    void shouldAddEducationWhenCandidateExists() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();
        UUID educationId = UUID.randomUUID();

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setEducations(new ArrayList<>());

        EducationRequest request = new EducationRequest(
            "Stanford University",
            "Computer Science",
            "Bachelor",
            LocalDate.of(2018, 9, 1),
            LocalDate.of(2022, 6, 15)
        );

        Education newEducation = new Education();
        newEducation.setId(educationId);
        newEducation.setCandidate(candidate);
        newEducation.setInstitution("Stanford University");
        newEducation.setFieldOfStudy("Computer Science");
        newEducation.setDegree("Bachelor");
        newEducation.setStartDate(LocalDate.of(2018, 9, 1));
        newEducation.setCompletionDate(LocalDate.of(2022, 6, 15));

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(educationMapper.toEducation(request, candidate)).thenReturn(newEducation);
        when(educationRepository.save(newEducation)).thenReturn(newEducation);

        educationService.addEducation(email, request);

        assertThat(candidate.getEducations()).contains(newEducation);
        verify(candidateRepository).findByUserEmail(email);
        verify(educationMapper).toEducation(request, candidate);
        verify(educationRepository).save(newEducation);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenAddEducationWithNonExistentCandidate() {
        String email = "nonexistent@example.com";
        EducationRequest request = new EducationRequest(
            "Stanford University",
            "Computer Science",
            "Bachelor",
            LocalDate.of(2018, 9, 1),
            LocalDate.of(2022, 6, 15)
        );

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> educationService.addEducation(email, request))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Candidate with id " + email + " not found");

        verify(candidateRepository).findByUserEmail(email);
        verify(educationMapper, never()).toEducation(any(), any());
        verify(educationRepository, never()).save(any());
    }

    @Test
    void shouldDeleteEducationWhenCandidateIsOwner() {
        UUID educationId = UUID.randomUUID();
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(email);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setEducations(new ArrayList<>());

        Education education = new Education();
        education.setId(educationId);
        education.setCandidate(candidate);

        candidate.getEducations().add(education);

        when(educationRepository.findById(educationId)).thenReturn(Optional.of(education));

        educationService.deleteEducation(email, educationId);

        assertThat(candidate.getEducations()).doesNotContain(education);
        verify(educationRepository).findById(educationId);
        verify(educationRepository).delete(education);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenDeleteEducationNotFound() {
        UUID educationId = UUID.randomUUID();
        String email = "candidate@example.com";

        when(educationRepository.findById(educationId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> educationService.deleteEducation(email, educationId))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Education with id " + educationId + " not found");

        verify(educationRepository).findById(educationId);
        verify(educationRepository, never()).delete(any());
    }

    @Test
    void shouldThrowAccessDeniedExceptionWhenDeleteEducationFromDifferentOwner() {
        UUID educationId = UUID.randomUUID();
        String ownerEmail = "owner@example.com";
        String requesterEmail = "other@example.com";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(ownerEmail);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setEducations(new ArrayList<>());

        Education education = new Education();
        education.setId(educationId);
        education.setCandidate(candidate);

        when(educationRepository.findById(educationId)).thenReturn(Optional.of(education));

        assertThatThrownBy(() -> educationService.deleteEducation(requesterEmail, educationId))
            .isInstanceOf(AccessDeniedException.class)
            .hasMessage("Operação inválida. Você não é o proprietário deste registro.");

        verify(educationRepository).findById(educationId);
        verify(educationRepository, never()).delete(any());
    }

    @Test
    void shouldHandleCaseInsensitiveEmailComparisonWhenDeleting() {
        UUID educationId = UUID.randomUUID();
        String emailLowerCase = "candidate@example.com";
        String emailUpperCase = "CANDIDATE@EXAMPLE.COM";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(emailLowerCase);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setEducations(new ArrayList<>());

        Education education = new Education();
        education.setId(educationId);
        education.setCandidate(candidate);

        candidate.getEducations().add(education);

        when(educationRepository.findById(educationId)).thenReturn(Optional.of(education));

        educationService.deleteEducation(emailUpperCase, educationId);

        assertThat(candidate.getEducations()).doesNotContain(education);
        verify(educationRepository).findById(educationId);
        verify(educationRepository).delete(education);
    }

}
