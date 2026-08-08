package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.request.CandidateLanguageRequest;
import com.gemstoneseekers.dtos.response.CandidateLanguageResponse;
import com.gemstoneseekers.enums.ProficiencyLevel;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateLanguage;
import com.gemstoneseekers.models.Language;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Component
public class CandidateLanguageMapper {

    public CandidateLanguageResponse toResponse(CandidateLanguage candidateLanguage) {

        return new CandidateLanguageResponse(candidateLanguage.getId().getLanguageId(),
                candidateLanguage.getLanguage().getName(), candidateLanguage.getProficiency());
    }

    public List<CandidateLanguageResponse> toResponseList(List<CandidateLanguage> candidateLanguages) {
        return candidateLanguages.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CandidateLanguage toCandidateLanguage(CandidateLanguageRequest request, Candidate candidate,
            Language language) {
        CandidateLanguage candidateLanguage = new CandidateLanguage();
        if (request == null || candidate == null || language == null) {
            return null;
        }
        candidateLanguage.setCandidate(candidate);
        candidateLanguage.setLanguage(language);
        candidateLanguage.setProficiency(ProficiencyLevel.valueOf(request.proficiency().toUpperCase(Locale.ROOT)));

        return candidateLanguage;
    }
}
