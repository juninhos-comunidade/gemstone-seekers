package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.CertificationRequest;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.CertificationMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Certification;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.CertificationRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CertificationService {
    private final CertificationMapper certificationMapper;
    private final CandidateRepository candidateRepository;
    private final CertificationRepository certificationRepository;

    public CertificationService(CertificationMapper certificationMapper, CandidateRepository candidateRepository,
            CertificationRepository certificationRepository) {
        this.certificationMapper = certificationMapper;
        this.candidateRepository = candidateRepository;
        this.certificationRepository = certificationRepository;
    }

    public void addCertification(String email, CertificationRequest request) {
        Candidate candidate = candidateRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Candidate", email));

        Certification newCertification = certificationMapper.toCertification(request, candidate);
        candidate.getCertifications().add(newCertification);
        certificationRepository.save(newCertification);
    }

    public void deleteCertification(String email, UUID certificationId) {

        Certification certification = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new EntityNotFoundException("Certification", certificationId));
        Candidate candidate = certification.getCandidate();

        if (!candidate.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Operação inválida. Você não é o proprietário deste registro.");
        }

        candidate.getCertifications().remove(certification);
        certificationRepository.delete(certification);
    }
}
