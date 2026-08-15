package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.ExperienceRequest;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.ExperienceMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Experience;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.ExperienceRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ExperienceService {

    private final UserProfileService userProfileService;
    private final ExperienceRepository experienceRepository;
    private final ExperienceMapper experienceMapper;
    private final CandidateRepository candidateRepository;

    public ExperienceService(UserProfileService userProfileService, ExperienceRepository experienceRepository,
            ExperienceMapper experienceMapper, CandidateRepository candidateRepository) {
        this.userProfileService = userProfileService;
        this.experienceRepository = experienceRepository;
        this.experienceMapper = experienceMapper;
        this.candidateRepository = candidateRepository;
    }

    public void addExperience(String email, ExperienceRequest request) {
        Candidate candidate = candidateRepository.findByUserEmail(email).orElseThrow(() -> new EntityNotFoundException(
                "Candidate", email));

        Experience newExperience = experienceMapper.toExperience(request, candidate);
        candidate.getExperiences().add(newExperience);
        experienceRepository.save(newExperience);
    }

    public void deleteExperience(String email, UUID linkId) {

        Experience experience = experienceRepository.findById(linkId).orElseThrow(() -> new EntityNotFoundException(
                "Link", linkId));
        Candidate candidate = experience.getCandidate();

        if (!candidate.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Operação inválida. Você não é o proprietário deste registro.");
        }

        candidate.getExperiences().remove(experience);
        experienceRepository.delete(experience);
    }
}
