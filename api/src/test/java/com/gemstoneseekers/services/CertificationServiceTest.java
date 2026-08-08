package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.CertificationRequest;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.CertificationMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Certification;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.CertificationRepository;
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
class CertificationServiceTest {

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private CertificationMapper certificationMapper;

    @InjectMocks
    private CertificationService certificationService;

    @Test
    void shouldAddCertificationWhenCandidateExists() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();
        UUID certificationId = UUID.randomUUID();

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setCertifications(new ArrayList<>());

        CertificationRequest request = new CertificationRequest(
            "AWS Certified Solutions Architect",
            "Amazon Web Services",
            LocalDate.of(2021, 1, 15),
            LocalDate.of(2024, 1, 15),
            "https://aws.amazon.com/verify"
        );

        Certification newCertification = new Certification();
        newCertification.setId(certificationId);
        newCertification.setCandidate(candidate);
        newCertification.setName("AWS Certified Solutions Architect");
        newCertification.setIssuingOrganization("Amazon Web Services");

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(certificationMapper.toCertification(request, candidate)).thenReturn(newCertification);
        when(certificationRepository.save(newCertification)).thenReturn(newCertification);

        certificationService.addCertification(email, request);

        assertThat(candidate.getCertifications()).contains(newCertification);
        verify(candidateRepository).findByUserEmail(email);
        verify(certificationMapper).toCertification(request, candidate);
        verify(certificationRepository).save(newCertification);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenAddCertificationWithNonExistentCandidate() {
        String email = "nonexistent@example.com";
        CertificationRequest request = new CertificationRequest(
            "AWS Certified Solutions Architect",
            "Amazon Web Services",
            LocalDate.of(2021, 1, 15),
            LocalDate.of(2024, 1, 15),
            "https://aws.amazon.com/verify"
        );

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> certificationService.addCertification(email, request))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Candidate with id " + email + " not found");

        verify(candidateRepository).findByUserEmail(email);
        verify(certificationMapper, never()).toCertification(any(), any());
        verify(certificationRepository, never()).save(any());
    }

    @Test
    void shouldDeleteCertificationWhenCandidateIsOwner() {
        UUID certificationId = UUID.randomUUID();
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(email);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setCertifications(new ArrayList<>());

        Certification certification = new Certification();
        certification.setId(certificationId);
        certification.setCandidate(candidate);

        candidate.getCertifications().add(certification);

        when(certificationRepository.findById(certificationId)).thenReturn(Optional.of(certification));

        certificationService.deleteCertification(email, certificationId);

        assertThat(candidate.getCertifications()).doesNotContain(certification);
        verify(certificationRepository).findById(certificationId);
        verify(certificationRepository).delete(certification);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenDeleteCertificationNotFound() {
        UUID certificationId = UUID.randomUUID();
        String email = "candidate@example.com";

        when(certificationRepository.findById(certificationId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> certificationService.deleteCertification(email, certificationId))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Certification with id " + certificationId + " not found");

        verify(certificationRepository).findById(certificationId);
        verify(certificationRepository, never()).delete(any());
    }

    @Test
    void shouldThrowAccessDeniedExceptionWhenDeleteCertificationFromDifferentOwner() {
        UUID certificationId = UUID.randomUUID();
        String ownerEmail = "owner@example.com";
        String requesterEmail = "other@example.com";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(ownerEmail);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);

        Certification certification = new Certification();
        certification.setId(certificationId);
        certification.setCandidate(candidate);

        when(certificationRepository.findById(certificationId)).thenReturn(Optional.of(certification));

        assertThatThrownBy(() -> certificationService.deleteCertification(requesterEmail, certificationId))
            .isInstanceOf(AccessDeniedException.class)
            .hasMessage("Operação inválida. Você não é o proprietário deste registro.");

        verify(certificationRepository).findById(certificationId);
        verify(certificationRepository, never()).delete(any());
    }

    @Test
    void shouldHandleCaseInsensitiveEmailComparisonWhenDeleting() {
        UUID certificationId = UUID.randomUUID();
        String emailLowerCase = "candidate@example.com";
        String emailUpperCase = "CANDIDATE@EXAMPLE.COM";
        UUID candidateId = UUID.randomUUID();

        User user = new User();
        user.setEmail(emailLowerCase);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setUser(user);
        candidate.setCertifications(new ArrayList<>());

        Certification certification = new Certification();
        certification.setId(certificationId);
        certification.setCandidate(candidate);

        candidate.getCertifications().add(certification);

        when(certificationRepository.findById(certificationId)).thenReturn(Optional.of(certification));

        certificationService.deleteCertification(emailUpperCase, certificationId);

        assertThat(candidate.getCertifications()).doesNotContain(certification);
        verify(certificationRepository).findById(certificationId);
        verify(certificationRepository).delete(certification);
    }

}
