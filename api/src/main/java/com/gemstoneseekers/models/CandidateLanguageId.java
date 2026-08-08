package com.gemstoneseekers.models;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.EqualsAndHashCode;


@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
@AllArgsConstructor
public class CandidateLanguageId implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(name = "candidate_id")
    private UUID candidateId;

    @Column(name = "language_id")
    private Integer languageId;

}
