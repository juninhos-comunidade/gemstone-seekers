package com.gemstoneseekers.models;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.*;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import jakarta.persistence.*;


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
    private Instant startedAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private Set<CandidateAnswer> answers = new LinkedHashSet<>();


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
    public void submit() {

        if (this.status != TestStatus.IN_PROGRESS) {
            throw new BusinessRuleException("Only tests in progress can be submitted");
        }

        this.score = calculateScore();
        this.status = TestStatus.COMPLETED;
        this.completedAt = Instant.now();
    }

    private BigDecimal calculateScore() {

        int totalQuestions = (this.answers != null) ? this.answers.size() : 0;

        if (totalQuestions == 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        long correctAnswersCount = this.answers.stream()
            .map(CandidateAnswer::getSelectedOption)
            .filter(Objects::nonNull)
            .filter(QuestionOption::isCorrect)
            .count();


        return BigDecimal.valueOf(correctAnswersCount)
            .multiply(BigDecimal.valueOf(10))
            .divide(BigDecimal.valueOf(totalQuestions), 2, RoundingMode.HALF_UP);
    }

    @Transient
    public QuestionDifficulty getDerivedDifficulty() {
        if (this.answers == null || this.answers.isEmpty()) {
            return QuestionDifficulty.BEGINNER;
        }
        return this.answers.stream()
            .map(answer -> answer.getQuestion().getDifficultyLevel())
            .findFirst()
            .orElse(QuestionDifficulty.BEGINNER);
    }
}
