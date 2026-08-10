package com.gemstoneseekers.models;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.OrderBy;


import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "tests")
@Getter
@Setter
@NoArgsConstructor
public class Test extends BaseModel {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technology_id", nullable = false)
    private Technology technology;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private TestStatus status = TestStatus.IN_PROGRESS;

    @Column(name = "score", precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt = OffsetDateTime.now();

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private Set<CandidateAnswer> answers = new LinkedHashSet<>();;


    public void addAnswer(CandidateAnswer answer) {
        answers.add(answer);
        answer.setTest(this);
    }

    public void answerQuestion(Long questionId, QuestionOption option) {
        CandidateAnswer answer = this.answers.stream()
            .filter(a -> a.getQuestion().getId().equals(questionId))
            .findFirst()
            .orElseThrow(() -> new BusinessRuleException(
                String.format("Question ID %d does not belong to Test ID %s", questionId, getId())            ));

        answer.setSelectedOption(option);
    }
}
