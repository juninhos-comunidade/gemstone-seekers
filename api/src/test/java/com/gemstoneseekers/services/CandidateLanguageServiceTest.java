package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.CandidateLanguageRequest;
import com.gemstoneseekers.enums.ProficiencyLevel;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.CandidateLanguageMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateLanguage;
import com.gemstoneseekers.models.CandidateLanguageId;
import com.gemstoneseekers.models.Language;
import com.gemstoneseekers.repositories.CandidateLanguageRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.LanguageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidateLanguageServiceTest {

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private CandidateLanguageMapper candidateLanguageMapper;

    @Mock
    private CandidateLanguageRepository candidateLanguagesRepository;

    @Mock
    private LanguageRepository languageRepository;

    @InjectMocks
    private CandidateLanguageService candidateLanguageService;

    @Test
    void shouldAddLanguageToCandidateWhenBothExist() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();
        Integer languageId = 1;

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setLanguages(new ArrayList<>());

        Language language = new Language();
        language.setId(languageId);
        language.setName("English");

        CandidateLanguageRequest request = new CandidateLanguageRequest("English", "advanced");

        CandidateLanguage newCandidateLanguage = new CandidateLanguage(candidate, language, ProficiencyLevel.ADVANCED);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(languageRepository.findByNameIgnoreCase("English")).thenReturn(Optional.of(language));
        when(candidateLanguageMapper.toCandidateLanguage(request, candidate, language)).thenReturn(
                newCandidateLanguage);
        when(candidateRepository.save(candidate)).thenReturn(candidate);

        candidateLanguageService.addCandidateLanguage(email, request);

        assertThat(candidate.getLanguages()).contains(newCandidateLanguage);
        verify(candidateRepository).findByUserEmail(email);
        verify(languageRepository).findByNameIgnoreCase("English");
        verify(candidateLanguageMapper).toCandidateLanguage(request, candidate, language);
        verify(candidateRepository).save(candidate);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenCandidateNotFoundDuringAdd() {
        String email = "nonexistent@example.com";
        CandidateLanguageRequest request = new CandidateLanguageRequest("English", "advanced");

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateLanguageService.addCandidateLanguage(email, request)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Candidate with id " + email + " not found");

        verify(candidateRepository).findByUserEmail(email);
        verify(languageRepository, never()).findByNameIgnoreCase(anyString());
        verify(candidateLanguageMapper, never()).toCandidateLanguage(any(), any(), any());
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenLanguageNotFound() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);

        CandidateLanguageRequest request = new CandidateLanguageRequest("Klingon", "advanced");

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(languageRepository.findByNameIgnoreCase("Klingon")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateLanguageService.addCandidateLanguage(email, request)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Language with id Klingon not found");

        verify(candidateRepository).findByUserEmail(email);
        verify(languageRepository).findByNameIgnoreCase("Klingon");
        verify(candidateLanguageMapper, never()).toCandidateLanguage(any(), any(), any());
    }

    @Test
    void shouldDeleteLanguageFromCandidateWhenExistsAndOwnershipIsValid() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();
        Integer languageId = 1;

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);

        Language language = new Language();
        language.setId(languageId);

        CandidateLanguage candidateLanguage = new CandidateLanguage(candidate, language, ProficiencyLevel.ADVANCED);

        candidate.setLanguages(new ArrayList<>());
        candidate.getLanguages().add(candidateLanguage);

        CandidateLanguageId id = new CandidateLanguageId(candidateId, languageId);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(candidateLanguagesRepository.findById(id)).thenReturn(Optional.of(candidateLanguage));

        candidateLanguageService.deleteCandidateLanguage(email, languageId);

        assertThat(candidate.getLanguages()).doesNotContain(candidateLanguage);
        verify(candidateRepository).findByUserEmail(email);
        verify(candidateLanguagesRepository).findById(id);
        verify(candidateLanguagesRepository).delete(candidateLanguage);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenCandidateNotFoundDuringDelete() {
        String email = "nonexistent@example.com";
        Integer languageId = 1;

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateLanguageService.deleteCandidateLanguage(email, languageId)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Candidate with id " + email + " not found");

        verify(candidateRepository).findByUserEmail(email);
        verify(candidateLanguagesRepository, never()).findById(any());
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenCandidateLanguageLinkNotFound() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();
        Integer languageId = 999;

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);

        CandidateLanguageId id = new CandidateLanguageId(candidateId, languageId);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(candidateLanguagesRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateLanguageService.deleteCandidateLanguage(email, languageId)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Language link not found for this candidate with id "
                        + languageId + " not found");

        verify(candidateRepository).findByUserEmail(email);
        verify(candidateLanguagesRepository).findById(id);
        verify(candidateLanguagesRepository, never()).delete(any());
    }

    @Test
    void shouldHandleCaseInsensitiveLanguageNameWhenAdding() {
        String email = "candidate@example.com";
        UUID candidateId = UUID.randomUUID();
        Integer languageId = 1;

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setLanguages(new ArrayList<>());

        Language language = new Language();
        language.setId(languageId);
        language.setName("English");

        CandidateLanguageRequest request = new CandidateLanguageRequest("ENGLISH", "fluent");

        CandidateLanguage newCandidateLanguage = new CandidateLanguage(candidate, language, ProficiencyLevel.FLUENT);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(languageRepository.findByNameIgnoreCase("ENGLISH")).thenReturn(Optional.of(language));
        when(candidateLanguageMapper.toCandidateLanguage(request, candidate, language)).thenReturn(
                newCandidateLanguage);
        when(candidateRepository.save(candidate)).thenReturn(candidate);

        candidateLanguageService.addCandidateLanguage(email, request);

        verify(languageRepository).findByNameIgnoreCase("ENGLISH");
        verify(candidateLanguageMapper).toCandidateLanguage(request, candidate, language);
    }

}
