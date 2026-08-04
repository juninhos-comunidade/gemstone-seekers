package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.CandidateLanguageResponse;
import com.gemstoneseekers.models.CandidateLanguage;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CandidateLanguageMapper {

    public CandidateLanguageResponse toResponse(CandidateLanguage candidateLanguage) {

        return new CandidateLanguageResponse(
            candidateLanguage.getId().getLanguageId(),
            candidateLanguage.getLanguage().getName(),
            candidateLanguage.getProficiency()
        );
    }

    public List<CandidateLanguageResponse> toResponseList(List<CandidateLanguage> candidateLanguages) {
        return candidateLanguages.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }


}
