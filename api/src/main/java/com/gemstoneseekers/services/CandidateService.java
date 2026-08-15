package com.gemstoneseekers.services;

import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.repositories.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public Candidate getCandidateByUserId(UUID id) {
        return candidateRepository.findByUserId(id).orElseThrow(() -> new EntityNotFoundException(
                "Candidate for User ID", id));
    }

    public Candidate getCandidateByEmailSession(String email) {
        return candidateRepository.findByUserEmail(email).orElseThrow(() -> new EntityNotFoundException("Candidate",
                email));

    }

}
