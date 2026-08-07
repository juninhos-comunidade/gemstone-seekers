package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.EducationRequest;
import com.gemstoneseekers.dtos.request.ExperienceRequest;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.EducationMapper;
import com.gemstoneseekers.mappers.ExperienceMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Education;
import com.gemstoneseekers.models.Experience;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.EducationRepository;
import com.gemstoneseekers.repositories.ExperienceRepository;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EducationService {
    private final EducationRepository educationRepository;
    private final CandidateRepository candidateRepository;
    private final EducationMapper educationMapper;

    public EducationService(EducationRepository educationRepository, CandidateRepository candidateRepository, EducationMapper educationMapper) {
        this.educationRepository = educationRepository;
        this.candidateRepository = candidateRepository;
        this.educationMapper = educationMapper;
    }
    public void addEducation(String email, EducationRequest request) {
        Candidate candidate = candidateRepository.findByUserEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Candidate", email));

        Education newEducation = educationMapper.toEducation(request, candidate);
        candidate.getEducations().add(newEducation);
        educationRepository.save(newEducation);
    }
    public void deleteEducation(String email, UUID educationId) {

        Education education = educationRepository.findById(educationId)
            .orElseThrow(() -> new EntityNotFoundException("Education", educationId));
        Candidate candidate = education.getCandidate();

        if (!candidate.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException(
                "Operação inválida. Você não é o proprietário deste registro."
            );
        }

        candidate.getEducations().remove(education);
        educationRepository.delete(education);
    }
}
