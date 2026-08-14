package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.ai.AiQuestionBatchResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.QuestionSource;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.QuestionOption;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.repositories.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Transactional
    public void saveAiGeneratedBatch(
        Technology technology,
        QuestionDifficulty difficulty,
        AiQuestionBatchResponse aiResponse
    ) {
        List<Question> questionsToSave = aiResponse.questions().stream().map(aiQuestion -> {
            Question question = new Question();
            question.setTechnology(technology);
            question.setDifficultyLevel(difficulty);
            question.setStatement(aiQuestion.statement());
            question.setSource(QuestionSource.AI_GENERATED);

            Set<QuestionOption> options = aiQuestion.options().stream().map(aiOption -> {
                QuestionOption option = new QuestionOption();
                option.setOptionText(aiOption.optionText());
                option.setCorrect(aiOption.isCorrect());

                option.setQuestion(question);
                return option;
            }).collect(Collectors.toSet());

            question.setOptions(options);
            return question;
        }).toList();

        questionRepository.saveAll(questionsToSave);
    }
}
