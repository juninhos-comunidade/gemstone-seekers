package com.gemstoneseekers.models;

import com.gemstoneseekers.enums.ProficiencyLevel;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "candidate_languages")
@Getter
@Setter
@NoArgsConstructor
public class CandidateLanguage {

    @EmbeddedId
    private CandidateLanguageId id = new CandidateLanguageId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("candidateId")
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("languageId")
    @JoinColumn(name = "language_id")
    private Language language;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)

    @Column(name = "proficiency", nullable = false, columnDefinition = "proficiency_level")
    private ProficiencyLevel proficiency;

    public CandidateLanguage(Candidate candidate, Language language, ProficiencyLevel proficiency) {
        this.candidate = candidate;
        this.language = language;
        this.proficiency = proficiency;
        this.id = new CandidateLanguageId(candidate.getId(), language.getId());
    }
}
