package com.gemstoneseekers.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "job_technologies")
@Getter
@Setter
@NoArgsConstructor
@IdClass(JobTechnologyId.class)
public class JobTechnology {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technology_id", nullable = false)
    private Technology technology;

    @Column(name = "is_mandatory", nullable = false)
    private Boolean isMandatory;

    public JobTechnology(Job job, Technology technology, Boolean isMandatory) {
        this.job = job;
        this.technology = technology;
        this.isMandatory = isMandatory;
    }
}
