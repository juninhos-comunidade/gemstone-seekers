package com.gemstoneseekers.services;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gemstoneseekers.dtos.response.LanguageResponse;
import com.gemstoneseekers.models.Language;
import com.gemstoneseekers.repositories.LanguageRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LanguageServiceTest {

    @Mock
    private LanguageRepository languageRepository;

    @InjectMocks
    private LanguageService languageService;

    @Test
    void shouldReturnAllLanguagesAsResponse() {
        Language lang1 = new Language();
        lang1.setId(1);
        lang1.setName("Portuguese");

        Language lang2 = new Language();
        lang2.setId(2);
        lang2.setName("English");

        when(languageRepository.findAll()).thenReturn(List.of(lang1, lang2));

        List<LanguageResponse> result = languageService.getLanguages();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).id()).isEqualTo(1);
        assertThat(result.get(0).name()).isEqualTo("Portuguese");
        assertThat(result.get(1).id()).isEqualTo(2);
        assertThat(result.get(1).name()).isEqualTo("English");
        verify(languageRepository).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoLanguages() {
        when(languageRepository.findAll()).thenReturn(List.of());

        List<LanguageResponse> result = languageService.getLanguages();

        assertThat(result).isEmpty();
        verify(languageRepository).findAll();
    }
}
