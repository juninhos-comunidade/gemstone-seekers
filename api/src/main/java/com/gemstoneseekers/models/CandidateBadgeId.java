package com.gemstoneseekers.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
@AllArgsConstructor
public class CandidateBadgeId implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;


    @Column(name = "candidate_id")
    private UUID candidateId;

    @Column(name = "badge_id")
    private Integer badgeId;
}
