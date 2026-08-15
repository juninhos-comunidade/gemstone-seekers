package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.request.TestHistoryFilterParams;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.dtos.response.CandidateTestHistoryResponse;
import com.gemstoneseekers.dtos.response.DifficultyHistoryGroupResponse;
import com.gemstoneseekers.dtos.response.TechnologyHistoryGroupResponse;
import com.gemstoneseekers.dtos.response.TestDetailedResultResponse;
import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.dtos.response.TestResultResponse;
import com.gemstoneseekers.dtos.response.TestSummaryResponse;
import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.TestMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.Test;
import com.gemstoneseekers.models.QuestionOption;
import com.gemstoneseekers.repositories.QuestionOptionRepository;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.TestRepository;

import com.gemstoneseekers.repositories.specifications.TestSpecifications;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TestApplicationService {
    private static final String TEST_ENTITY_NAME = "Test";
    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;
    private final CandidateService candidateService;
    private final TechnologyService technologyService;
    private final TestMapper testMapper;
    private final QuestionOptionRepository questionOptionRepository;

    private static final int REQUIRED_AMOUNT = 10;

    public TestApplicationService(QuestionRepository questionRepository, TestRepository testRepository,
            CandidateService candidateService, TechnologyService technologyService, TestMapper testMapper,
            QuestionOptionRepository questionOptionRepository) {
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

        Optional<Test> activeTest = testRepository.findByCandidateIdAndTechnologyNameAndStatus(candidate.getId(),
                technologyName, TestStatus.IN_PROGRESS);

        if (activeTest.isPresent()) {
            return testMapper.toTestAndQuestionsResponse(activeTest.get());
        }

        List<Question> questions = questionRepository.findUnansweredRandomByTechnologyAndDifficulty(technologyName,
                difficulty, candidate.getId(), REQUIRED_AMOUNT);

        if (questions.isEmpty()) {
            throw new BusinessRuleException(String.format("No questions found for technology '%s' with difficulty '%s'",
                    technologyName, difficulty));
        }
        Test newTest = new Test();
        newTest.setCandidate(candidate);
        newTest.setTechnology(technology);
        newTest.setStatus(TestStatus.IN_PROGRESS);

        Set<CandidateAnswer> candidateAnswers = questions.stream().map(question -> {
            CandidateAnswer answer = new CandidateAnswer();
            answer.setTest(newTest);
            answer.setQuestion(question);
            return answer;
        }).collect(Collectors.toSet());

        newTest.setAnswers(candidateAnswers);

        Test savedTest = testRepository.save(newTest);
        return testMapper.toTestAndQuestionsResponse(savedTest);
    }

    @Transactional
    public void saveCandidateAnswer(UUID testId, Long questionId, SaveAnswerRequest request, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Test test = testRepository.findById(testId).orElseThrow(() -> new EntityNotFoundException(TEST_ENTITY_NAME,
                testId));

        if (!test.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this test");
        }

        if (test.getStatus() != TestStatus.IN_PROGRESS) {
            throw new BusinessRuleException("Cannot save answers for a test that is not IN_PROGRESS");
        }

        QuestionOption selectedOption = questionOptionRepository.findById(request.selectedOptionId()).orElseThrow(
                () -> new EntityNotFoundException("QuestionOption", request.selectedOptionId()));

        if (!selectedOption.getQuestion().getId().equals(questionId)) {
            throw new BusinessRuleException(String.format("Option ID %d does not belong to Question ID %d", request
                    .selectedOptionId(), questionId));
        }

        test.answerQuestion(questionId, selectedOption);
    }

    @Transactional
    public TestResultResponse submitTest(UUID testId, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Test test = testRepository.findById(testId).orElseThrow(() -> new EntityNotFoundException(TEST_ENTITY_NAME,
                testId));

        if (!test.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to submit this test");
        }

        test.submit();

        Test savedTest = testRepository.save(test);

        return testMapper.toTestResultResponse(savedTest);
    }

    @Transactional(readOnly = true)
    public CandidateTestHistoryResponse getCandidateTestHistory(String email, TestHistoryFilterParams filters) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Specification<Test> specification = TestSpecifications.withFilters(candidate.getId(), filters);

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        List<Test> filteredTests = testRepository.findAll(specification, sort);

        Map<String, Map<QuestionDifficulty, List<Test>>> grouped = filteredTests.stream().collect(Collectors.groupingBy(
                test -> test.getTechnology().getName(), Collectors.groupingBy(Test::getDerivedDifficulty)));

        List<TechnologyHistoryGroupResponse> historyByTechnology = grouped.entrySet().stream().map(techEntry -> {
            String techName = techEntry.getKey();
            Map<QuestionDifficulty, List<Test>> difficultyMap = techEntry.getValue();

            List<DifficultyHistoryGroupResponse> difficultyGroups = difficultyMap.entrySet().stream().map(diffEntry -> {
                QuestionDifficulty difficulty = diffEntry.getKey();
                List<Test> diffTests = diffEntry.getValue();

                List<TestSummaryResponse> summaryList = diffTests.stream().map(testMapper::toSummaryResponse).toList();

                BigDecimal avgScore = calculateAverageScore(diffTests);

                return new DifficultyHistoryGroupResponse(difficulty, diffTests.size(), avgScore, summaryList);
            }).sorted(Comparator.comparing(d -> d.difficulty().ordinal())).toList();

            return new TechnologyHistoryGroupResponse(techName, difficultyGroups);
        }).toList();

        return new CandidateTestHistoryResponse(candidate.getId(), filteredTests.size(), historyByTechnology);
    }

    private BigDecimal calculateAverageScore(List<Test> tests) {
        List<Test> completedTests = tests.stream().filter(t -> t.getScore() != null).toList();

        if (completedTests.isEmpty()) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal sum = completedTests.stream().map(Test::getScore).reduce(BigDecimal.ZERO, BigDecimal::add);

        return sum.divide(BigDecimal.valueOf(completedTests.size()), 2, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public TestDetailedResultResponse getTestResult(UUID testId, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Test test = testRepository.findById(testId).orElseThrow(() -> new EntityNotFoundException(TEST_ENTITY_NAME,
                testId));

        if (!test.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to view this test");
        }

        if (test.getStatus() == TestStatus.IN_PROGRESS) {
            throw new BusinessRuleException("Cannot view detailed results for a test that is currently IN_PROGRESS");
        }

        return testMapper.toDetailedResultResponse(test);
    }

    @Transactional
    public void cancelTest(UUID testId, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Test test = testRepository.findById(testId).orElseThrow(() -> new EntityNotFoundException(TEST_ENTITY_NAME,
                testId));

        if (!test.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this test");
        }

        if (test.getStatus() != TestStatus.IN_PROGRESS) {
            throw new BusinessRuleException(String.format(
                    "Cannot cancel test. Current status is %s, expected IN_PROGRESS", test.getStatus()));
        }

        test.setStatus(TestStatus.CANCELED);

        test.setCompletedAt(Instant.now());

        testRepository.save(test);
    }

}
