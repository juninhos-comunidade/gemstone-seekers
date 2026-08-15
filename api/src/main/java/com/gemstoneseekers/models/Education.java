package com.gemstoneseekers.models;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "educations")
@Getter
@Setter
@NoArgsConstructor
public class Education extends BaseModel {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(name = "institution", nullable = false, columnDefinition = "TEXT")
    private String institution;

    @Column(name = "field_of_study", nullable = false, columnDefinition = "TEXT")
    private String fieldOfStudy;

    @Column(name = "degree", columnDefinition = "TEXT")
    private String degree;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @ManyToMany
    @JoinTable(name = "education_technologies", joinColumns = @JoinColumn(name = "education_id"),
            inverseJoinColumns = @JoinColumn(name = "technology_id"))
    private Set<Technology> technologies;

}
