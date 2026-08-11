package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.dtos.response.TestResultResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.TestMapper;
import com.gemstoneseekers.models.*;
import com.gemstoneseekers.repositories.QuestionOptionRepository;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.TestRepository;

import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TestApplicationService {

    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;
    private final CandidateService candidateService;
    private final TechnologyService technologyService;
    private final TestMapper testMapper;
    private final QuestionOptionRepository questionOptionRepository;

    private static final int REQUIRED_AMOUNT = 10;

    public TestApplicationService(QuestionRepository questionRepository,
                                  TestRepository testRepository,
                                  CandidateService candidateService,
                                  TechnologyService technologyService,
                                  TestMapper testMapper, QuestionOptionRepository questionOptionRepository) {
        this.questionRepository = questionRepository;
        this.testRepository = testRepository;
        this.candidateService = candidateService;
        this.technologyService = technologyService;
        this.testMapper = testMapper;
        this.questionOptionRepository = questionOptionRepository;
    }
    @Transactional
    public TestResponse startTest(String email, String technologyName, QuestionDifficulty difficulty) {

        Candidate candidate = candidateService.getCandidateByEmailSession(email);
        Technology technology = technologyService.getTechnologyByName(technologyName);

        Optional<Test> activeTest = testRepository.findByCandidateIdAndTechnologyNameAndStatus(
            candidate.getId(), technologyName, TestStatus.IN_PROGRESS
        );

        if (activeTest.isPresent()) {
            return testMapper.toTestAndQuestionsResponse(activeTest.get());
        }

        List<Question> questions = questionRepository.findUnansweredRandomByTechnologyAndDifficulty(
            technologyName, difficulty,candidate.getId(), REQUIRED_AMOUNT
        );

        if (questions.isEmpty()) {
            throw new BusinessRuleException(
                String.format("No questions found for technology '%s' with difficulty '%s'", technologyName, difficulty)
            );
        }
        Test newTest = new Test();
        newTest.setCandidate(candidate);
        newTest.setTechnology(technology);
        newTest.setStatus(TestStatus.IN_PROGRESS);

        Set<CandidateAnswer> candidateAnswers = questions.stream()
            .map(question -> {
                CandidateAnswer answer = new CandidateAnswer();
                answer.setTest(newTest);
                answer.setQuestion(question);
                return answer;
            })
            .collect(Collectors.toSet());

        newTest.setAnswers(candidateAnswers);

        Test savedTest = testRepository.save(newTest);
        return testMapper.toTestAndQuestionsResponse(savedTest);
    }

    @Transactional(readOnly = true)
    public TestResponse getActiveTestAndQuestions(String email, String technologyName) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);
        Technology technology = technologyService.getTechnologyByName(technologyName);

        Test test = testRepository.findByCandidateAndTechnologyAndStatus(candidate, technology, TestStatus.IN_PROGRESS)
            .orElseThrow(() -> new EntityNotFoundException("Test", technologyName));

        return testMapper.toTestAndQuestionsResponse(test);
    }
    @Transactional
    public void saveCandidateAnswer(UUID testId, Long questionId, SaveAnswerRequest request, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Test test = testRepository.findById(testId)
            .orElseThrow(() -> new EntityNotFoundException("Test", testId));

        if (!test.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this test");
        }

        if (test.getStatus() != TestStatus.IN_PROGRESS) {
            throw new BusinessRuleException("Cannot save answers for a test that is not IN_PROGRESS");
        }

        QuestionOption selectedOption = questionOptionRepository.findById(request.selectedOptionId())
            .orElseThrow(() -> new EntityNotFoundException("QuestionOption", request.selectedOptionId()));

        if (!selectedOption.getQuestion().getId().equals(questionId)) {
            throw new BusinessRuleException(
                String.format("Option ID %d does not belong to Question ID %d", request.selectedOptionId(), questionId)
            );
        }

        test.answerQuestion(questionId, selectedOption);
    }
    @Transactional
    public TestResultResponse submitTest(UUID testId, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Test test = testRepository.findById(testId)
            .orElseThrow(() -> new EntityNotFoundException("Test", testId));

        if (!test.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to submit this test");
        }

        test.submit();

        Test savedTest = testRepository.save(test);

        return testMapper.toTestResultResponse(savedTest);
    }
}
