package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.LinkItemRequest;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.CandidateLinkMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateLink;
import com.gemstoneseekers.repositories.CandidateLinkRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CandidateLinkService {

    private final CandidateRepository candidateRepository;
    private final CandidateLinkRepository candidateLinkRepository;
    private final CandidateLinkMapper candidateLinkMapper;
    public CandidateLinkService(CandidateRepository candidateRepository,
            CandidateLinkRepository candidateLinkRepository, CandidateLinkMapper candidateLinkMapper) {
        this.candidateRepository = candidateRepository;
        this.candidateLinkRepository = candidateLinkRepository;
        this.candidateLinkMapper = candidateLinkMapper;
    }

    @Transactional
    public void addLink(String email, LinkItemRequest request) {
        Candidate candidate = candidateRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Candidate", email));

        CandidateLink newLink = candidateLinkMapper.toCandidateLink(request, candidate);
        candidate.getLinks().add(newLink);
        candidateLinkRepository.save(newLink);
    }

    @Transactional
    public void deleteLink(String email, UUID linkId) {

        CandidateLink link = candidateLinkRepository.findById(linkId)
                .orElseThrow(() -> new EntityNotFoundException("Link", linkId));
        Candidate candidate = link.getCandidate();

        if (!candidate.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Operação inválida. Você não é o proprietário deste registro.");
        }

        candidate.getLinks().remove(link);
        candidateLinkRepository.delete(link);

    }
}
