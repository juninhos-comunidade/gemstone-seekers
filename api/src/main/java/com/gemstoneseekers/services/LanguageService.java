package com.gemstoneseekers.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.response.LanguageResponse;
import com.gemstoneseekers.models.Language;
import com.gemstoneseekers.repositories.LanguageRepository;

@Service
public class LanguageService {

    private final LanguageRepository languageRepository;

    public LanguageService(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    public List<LanguageResponse> getLanguages() {
        List<Language> languages = languageRepository.findAll();
        return languages.stream()
            .map(l -> new LanguageResponse(l.getId(), l.getName()))
            .toList();
    }
}
