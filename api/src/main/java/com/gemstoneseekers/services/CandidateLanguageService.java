package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.CandidateLanguageRequest;

import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.CandidateLanguageMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateLanguage;
import com.gemstoneseekers.models.CandidateLanguageId;
import com.gemstoneseekers.models.Language;
import com.gemstoneseekers.repositories.CandidateLanguageRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.LanguageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class CandidateLanguageService {
    private final CandidateRepository candidateRepository;
    private final CandidateLanguageMapper candidateLanguageMapper;
    private final CandidateLanguageRepository candidateLanguagesRepository;
    private final LanguageRepository languageRepository;

    public CandidateLanguageService(CandidateRepository candidateRepository,
            CandidateLanguageMapper candidateLanguageMapper, CandidateLanguageRepository candidateLanguagesRepository,
            LanguageRepository languageRepository) {
        this.candidateRepository = candidateRepository;
        this.candidateLanguageMapper = candidateLanguageMapper;
        this.candidateLanguagesRepository = candidateLanguagesRepository;
        this.languageRepository = languageRepository;
    }

    @Transactional
    public void addCandidateLanguage(String email, CandidateLanguageRequest request) {
        Candidate candidate = candidateRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Candidate", email));

        Language language = languageRepository.findByNameIgnoreCase(request.languageName())
                .orElseThrow(() -> new EntityNotFoundException("Language", request.languageName()));

        CandidateLanguage newLanguage = candidateLanguageMapper.toCandidateLanguage(request, candidate, language);

        candidate.getLanguages().add(newLanguage);
        candidateRepository.save(candidate);

    }

    @Transactional
    public void deleteCandidateLanguage(String email, Integer languageId) {
        Candidate candidate = candidateRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Candidate", email));

        CandidateLanguageId idComposta = new CandidateLanguageId(candidate.getId(), languageId);

        CandidateLanguage candidateLanguage = candidateLanguagesRepository.findById(idComposta).orElseThrow(
                () -> new EntityNotFoundException("Language link not found for this candidate", languageId));

        candidate.getLanguages().remove(candidateLanguage);
        candidateLanguagesRepository.delete(candidateLanguage);

    }
}
