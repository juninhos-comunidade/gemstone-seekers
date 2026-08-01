package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.LanguageResponse;
import com.gemstoneseekers.models.Language;

@Component
public class LanguageMapper {
    public LanguageResponse toLanguageResponse(Language language) {
        return new LanguageResponse(language.getId(), language.getName());
    }
}
