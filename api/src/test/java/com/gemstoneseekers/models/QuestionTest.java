package com.gemstoneseekers.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class QuestionTest {

    private Question question;

    @BeforeEach
    void setUp() {
        question = new Question();
        question.setOptions(new HashSet<>());
    }

    @Test
    @DisplayName("addOption should establish a bidirectional relationship")
    void addOption_shouldEstablishBidirectionalRelationship() {
        QuestionOption option = new QuestionOption();

        question.addOption(option);

        assertThat(question.getOptions()).contains(option);
        assertThat(option.getQuestion()).isEqualTo(question);
    }

    @Test
    @DisplayName("removeOption should break the bidirectional relationship")
    void removeOption_shouldBreakBidirectionalRelationship() {
        QuestionOption option = new QuestionOption();
        question.addOption(option);

        question.removeOption(option);

        assertThat(question.getOptions()).doesNotContain(option);
        assertThat(option.getQuestion()).isNull();
    }

    @Test
    @DisplayName("equals and hashCode should be based on object identity by default")
    void equalsAndHashCode_shouldBeBasedOnObjectIdentity() {
        Question question1 = new Question();
        question1.setId(1L);
        question1.setStatement("What is Java?");

        Question question2 = new Question();
        question2.setId(1L);
        question2.setStatement("What is Java?");

        assertThat(question1).isNotEqualTo(question2);
        assertThat(question1.hashCode()).isNotEqualTo(question2.hashCode());

        Set<Question> questionSet = new HashSet<>();
        questionSet.add(question1);
        questionSet.add(question2);

        assertThat(questionSet).hasSize(2);
    }
}
