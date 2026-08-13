package com.gemstoneseekers.services;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.events.LowQuestionStockEvent;
import com.gemstoneseekers.exceptions.InsufficientQuestionsException;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class QuestionSelectionService {

    private static final Logger log = LoggerFactory.getLogger(QuestionSelectionService.class);
    private static final int QUESTIONS_PER_TEST = 10;
    private static final int MIN_UNSEEN_QUESTIONS = 3;

    private final QuestionRepository questionRepository;
    private final ApplicationEventPublisher eventPublisher;

    public QuestionSelectionService(QuestionRepository questionRepository, ApplicationEventPublisher eventPublisher) {
        this.questionRepository = questionRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public List<Question> generateTestQuestions(User user, Technology tech, QuestionDifficulty difficulty) {

        List<Question> unseenQuestions = questionRepository.findRandomUnseenQuestions(
            user.getId(),
            tech.getId(),
            difficulty.name(),
            QUESTIONS_PER_TEST
        );

        if (unseenQuestions.size() < MIN_UNSEEN_QUESTIONS) {
            log.warn("[QUIZ] User {} blocked. Only {} unseen questions for {}. Triggering AI.",
                user.getId(), unseenQuestions.size(), tech.getName());

            eventPublisher.publishEvent(new LowQuestionStockEvent(tech, difficulty));
            throw new InsufficientQuestionsException("Estamos gerando questões inéditas para você! Aguarde alguns instantes e tente novamente.");
        }

        List<Question> testQuestions = new ArrayList<>(unseenQuestions);

        if (unseenQuestions.size() < 6) {
            eventPublisher.publishEvent(new LowQuestionStockEvent(tech, difficulty));
        }

        int missingQuestions = QUESTIONS_PER_TEST - testQuestions.size();

        if (missingQuestions > 0) {
            List<Question> seenQuestions = questionRepository.findRandomSeenQuestions(
                user.getId(),
                tech.getId(),
                difficulty.name(),
                missingQuestions
            );

            if (seenQuestions.size() < missingQuestions) {
                eventPublisher.publishEvent(new LowQuestionStockEvent(tech, difficulty));
                throw new InsufficientQuestionsException("O acervo global ainda está sendo populado. Tente em breve.");
            }

            testQuestions.addAll(seenQuestions);
        }

        Collections.shuffle(testQuestions);

        return testQuestions;
    }
}
