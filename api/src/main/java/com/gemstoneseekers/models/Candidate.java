package com.gemstoneseekers.models;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;

import org.hibernate.annotations.UuidGenerator;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
public class Candidate extends BaseModel {
    public static final String TABLE_NAME = "candidate";
    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(name = "phone")
    private String phone;

    @OneToMany(mappedBy = TABLE_NAME, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateLink> links;

    @OneToMany(mappedBy = TABLE_NAME, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateLanguage> languages = new ArrayList<>();

    @OneToMany(mappedBy = TABLE_NAME, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = TABLE_NAME, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = TABLE_NAME, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certification> certifications = new ArrayList<>();

    @OneToMany(mappedBy = TABLE_NAME, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = TABLE_NAME, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Test> tests = new ArrayList<>();

    @Column(name = "summary")
    private String summary;
}
