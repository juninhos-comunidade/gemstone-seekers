package com.gemstoneseekers.models;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateLanguageId implements Serializable {

    @Column(name = "candidate_id")
    private UUID candidateId;

    @Column(name = "language_id")
    private Integer languageId;

}
