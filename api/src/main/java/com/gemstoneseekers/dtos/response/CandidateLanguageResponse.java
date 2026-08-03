package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.ProficiencyLevel;



public record CandidateLanguageResponse(
    Integer languageId,
    String languageName,
    ProficiencyLevel proficiency
) {}
