package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.response.CandidateTestHistoryResponse;
import com.gemstoneseekers.dtos.response.DifficultyHistoryGroupResponse;
import com.gemstoneseekers.dtos.response.QuestionResultResponse;
import com.gemstoneseekers.dtos.response.TestDetailedResultResponse;
import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.dtos.response.TestResultResponse;
import com.gemstoneseekers.dtos.response.TestSummaryResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.dtos.response.TechnologyHistoryGroupResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.TestMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.QuestionOption;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.QuestionOptionRepository;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.TestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.LongStream;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TestApplicationServiceTest {

    @InjectMocks
    private TestApplicationService testApplicationService;

    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private TestRepository testRepository;
    @Mock
    private CandidateService candidateService;
    @Mock
    private TechnologyService technologyService;
    @Mock
    private TestMapper testMapper;
    @Mock
    private QuestionOptionRepository questionOptionRepository;

    @Captor
    private ArgumentCaptor<com.gemstoneseekers.models.Test> testArgumentCaptor;

    private Candidate mockCandidate;
    private Technology mockTechnology;

    @BeforeEach
    void setUp() {
        mockCandidate = new Candidate();
        mockCandidate.setId(UUID.randomUUID());
        User user = new User();
        user.setEmail("candidate@test.com");
        mockCandidate.setUser(user);

        mockTechnology = new Technology();
        mockTechnology.setId(1);
        mockTechnology.setName("Java");
    }

    @Test
    @DisplayName("startTest should create a new test when no test is in progress")
    void startTest_shouldCreateNewTest_whenNoTestIsInProgress() {
        String userEmail = "candidate@test.com";
        String technologyName = "Java";
        QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;
        int requiredAmount = 10;

        List<Question> mockQuestions = LongStream.rangeClosed(1, requiredAmount).mapToObj(id -> {
            Question q = new Question();
            q.setId(id);
            return q;
        }).collect(Collectors.toList());

        TestResponse expectedResponse = new TestResponse(UUID.randomUUID(),
                new TechnologyResponse(mockTechnology.getId(), mockTechnology.getName(), mockTechnology.getCategory()),
                TestStatus.IN_PROGRESS, Collections.emptyList());

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(technologyService.getTechnologyByName(technologyName)).thenReturn(mockTechnology);
        when(testRepository.findByCandidateIdAndTechnologyNameAndStatus(mockCandidate.getId(), technologyName,
                TestStatus.IN_PROGRESS)).thenReturn(Optional.empty());
        when(questionRepository.findUnansweredRandomByTechnologyAndDifficulty(technologyName, difficulty,
                mockCandidate.getId(), requiredAmount)).thenReturn(mockQuestions);
        when(testRepository.save(any(com.gemstoneseekers.models.Test.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(testMapper.toTestAndQuestionsResponse(any(com.gemstoneseekers.models.Test.class)))
                .thenReturn(expectedResponse);

        TestResponse actualResponse = testApplicationService.startTest(userEmail, technologyName, difficulty);

        assertThat(actualResponse).isEqualTo(expectedResponse);

        verify(testRepository).save(testArgumentCaptor.capture());
        com.gemstoneseekers.models.Test savedTest = testArgumentCaptor.getValue();

        assertThat(savedTest.getCandidate()).isEqualTo(mockCandidate);
        assertThat(savedTest.getTechnology()).isEqualTo(mockTechnology);
        assertThat(savedTest.getStatus()).isEqualTo(TestStatus.IN_PROGRESS);
        assertThat(savedTest.getAnswers()).hasSize(requiredAmount);
        assertThat(savedTest.getAnswers().stream().map(ca -> ca.getQuestion().getId()))
                .containsExactlyInAnyOrderElementsOf(
                        mockQuestions.stream().map(Question::getId).collect(Collectors.toSet()));
    }

    @Test
    @DisplayName("startTest should return in-progress test when one already exists")
    void startTest_shouldReturnInProgressTest_whenTestAlreadyExists() {

        String userEmail = "candidate@test.com";
        String technologyName = "Java";
        QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;

        com.gemstoneseekers.models.Test existingTest = new com.gemstoneseekers.models.Test();
        existingTest.setId(UUID.randomUUID());
        existingTest.setStatus(TestStatus.IN_PROGRESS);
        existingTest.setCandidate(mockCandidate);
        existingTest.setTechnology(mockTechnology);

        TestResponse expectedResponse = new TestResponse(existingTest.getId(),
                new TechnologyResponse(mockTechnology.getId(), mockTechnology.getName(), mockTechnology.getCategory()),
                TestStatus.IN_PROGRESS, Collections.emptyList());

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(technologyService.getTechnologyByName(technologyName)).thenReturn(mockTechnology);
        when(testRepository.findByCandidateIdAndTechnologyNameAndStatus(mockCandidate.getId(), technologyName,
                TestStatus.IN_PROGRESS)).thenReturn(Optional.of(existingTest));
        when(testMapper.toTestAndQuestionsResponse(existingTest)).thenReturn(expectedResponse);

        TestResponse actualResponse = testApplicationService.startTest(userEmail, technologyName, difficulty);

        assertThat(actualResponse).isEqualTo(expectedResponse);
        verify(questionRepository, never()).findUnansweredRandomByTechnologyAndDifficulty(anyString(), any(),
                any(UUID.class), anyInt());
        verify(testRepository, never()).save(any(com.gemstoneseekers.models.Test.class));
    }

    @Test
    @DisplayName("startTest should throw BusinessRuleException when no questions are found")
    void startTest_shouldThrowBusinessRuleException_whenNoQuestionsAreFound() {

        String userEmail = "candidate@test.com";
        String technologyName = "Java";
        QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;
        int requiredAmount = 10;

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(technologyService.getTechnologyByName(technologyName)).thenReturn(mockTechnology);
        when(testRepository.findByCandidateIdAndTechnologyNameAndStatus(mockCandidate.getId(), technologyName,
                TestStatus.IN_PROGRESS)).thenReturn(Optional.empty());
        when(questionRepository.findUnansweredRandomByTechnologyAndDifficulty(technologyName, difficulty,
                mockCandidate.getId(), requiredAmount)).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> testApplicationService.startTest(userEmail, technologyName, difficulty))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("No questions found for technology 'Java' with difficulty 'BEGINNER'");

        verify(testRepository, never()).save(any(com.gemstoneseekers.models.Test.class));
    }

    @Test
    @DisplayName("saveCandidateAnswer should save the selected option for the given question")
    void saveCandidateAnswer_shouldSaveSelectedOption() {

        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();
        Long questionId = 1L;
        Long selectedOptionId = 101L;

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.IN_PROGRESS);

        Question question = new Question();
        question.setId(questionId);

        CandidateAnswer candidateAnswer = new CandidateAnswer();
        candidateAnswer.setTest(test);
        candidateAnswer.setQuestion(question);
        test.setAnswers(new HashSet<>(Collections.singletonList(candidateAnswer)));

        QuestionOption selectedOption = new QuestionOption();
        selectedOption.setId(selectedOptionId);
        selectedOption.setQuestion(question);

        SaveAnswerRequest request = new SaveAnswerRequest(questionId, selectedOptionId);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        when(questionOptionRepository.findById(selectedOptionId)).thenReturn(Optional.of(selectedOption));

        testApplicationService.saveCandidateAnswer(testId, questionId, request, userEmail);

        Optional<CandidateAnswer> answerOptional = test.getAnswers().stream()
                .filter(a -> a.getQuestion().getId().equals(questionId)).findFirst();

        assertThat(answerOptional).isPresent();
        assertThat(answerOptional.get().getSelectedOption()).isEqualTo(selectedOption);
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw EntityNotFoundException when test is not found")
    void saveCandidateAnswer_shouldThrowEntityNotFoundException_whenTestNotFound() {

        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();
        Long questionId = 1L;
        SaveAnswerRequest request = new SaveAnswerRequest(questionId, 101L);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> testApplicationService.saveCandidateAnswer(testId, questionId, request, userEmail))
                .isInstanceOf(EntityNotFoundException.class).hasMessage("Test with id " + testId + " not found");
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw AccessDeniedException when candidate does not own the test")
    void saveCandidateAnswer_shouldThrowAccessDeniedException_whenCandidateDoesNotOwnTest() {

        String userEmail = "attacker@test.com";
        UUID testId = UUID.randomUUID();
        Long questionId = 1L;
        SaveAnswerRequest request = new SaveAnswerRequest(questionId, 101L);

        Candidate attacker = new Candidate();
        attacker.setId(UUID.randomUUID());
        User attackerUser = new User();
        attackerUser.setEmail(userEmail);
        attacker.setUser(attackerUser);

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(attacker);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> testApplicationService.saveCandidateAnswer(testId, questionId, request, userEmail))
                .isInstanceOf(AccessDeniedException.class).hasMessage("You do not have permission to modify this test");
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw EntityNotFoundException when selected option is not found")
    void saveCandidateAnswer_shouldThrowEntityNotFoundException_whenSelectedOptionNotFound() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();
        Long questionId = 1L;
        Long selectedOptionId = 101L;

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.IN_PROGRESS);

        Question question = new Question();
        question.setId(questionId);
        CandidateAnswer candidateAnswer = new CandidateAnswer();
        candidateAnswer.setTest(test);
        candidateAnswer.setQuestion(question);
        test.setAnswers(new HashSet<>(Collections.singletonList(candidateAnswer)));

        SaveAnswerRequest request = new SaveAnswerRequest(questionId, selectedOptionId);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        when(questionOptionRepository.findById(selectedOptionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> testApplicationService.saveCandidateAnswer(testId, questionId, request, userEmail))
                .isInstanceOf(EntityNotFoundException.class).hasMessage("QuestionOption with id 101 not found");
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw BusinessRuleException when test is not in progress")
    void saveCandidateAnswer_shouldThrowBusinessRuleException_whenTestIsNotInProgress() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();
        Long questionId = 1L;
        SaveAnswerRequest request = new SaveAnswerRequest(questionId, 101L);

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.COMPLETED);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> testApplicationService.saveCandidateAnswer(testId, questionId, request, userEmail))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Cannot save answers for a test that is not IN_PROGRESS");
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw BusinessRuleException when option does not belong to question")
    void saveCandidateAnswer_shouldThrowBusinessRuleException_whenOptionDoesNotBelongToQuestion() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();
        Long questionId = 1L;
        Long otherQuestionId = 2L;
        Long selectedOptionId = 101L;

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.IN_PROGRESS);

        Question testQuestion = new Question();
        testQuestion.setId(questionId);
        CandidateAnswer candidateAnswer = new CandidateAnswer();
        candidateAnswer.setTest(test);
        candidateAnswer.setQuestion(testQuestion);
        test.setAnswers(new HashSet<>(Collections.singletonList(candidateAnswer)));

        QuestionOption selectedOption = new QuestionOption();
        selectedOption.setId(selectedOptionId);
        Question otherQuestion = new Question();
        otherQuestion.setId(otherQuestionId);
        selectedOption.setQuestion(otherQuestion);

        SaveAnswerRequest request = new SaveAnswerRequest(questionId, selectedOptionId);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        when(questionOptionRepository.findById(selectedOptionId)).thenReturn(Optional.of(selectedOption));

        assertThatThrownBy(() -> testApplicationService.saveCandidateAnswer(testId, questionId, request, userEmail))
                .isInstanceOf(BusinessRuleException.class).hasMessage("Option ID 101 does not belong to Question ID 1");
    }

    @Test
    @DisplayName("submitTest should complete test and return result")
    void submitTest_shouldCompleteTestAndReturnResult() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();

        Question question1 = new Question();
        question1.setId(1L);
        Question question2 = new Question();
        question2.setId(2L);

        QuestionOption correctOption = new QuestionOption();
        correctOption.setId(11L);
        correctOption.setCorrect(true);
        correctOption.setQuestion(question1);

        QuestionOption wrongOption = new QuestionOption();
        wrongOption.setId(12L);
        wrongOption.setCorrect(false);
        wrongOption.setQuestion(question2);

        CandidateAnswer answer1 = new CandidateAnswer();
        answer1.setQuestion(question1);
        answer1.setSelectedOption(correctOption);
        CandidateAnswer answer2 = new CandidateAnswer();
        answer2.setQuestion(question2);
        answer2.setSelectedOption(wrongOption);

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setTechnology(mockTechnology);
        test.setStatus(TestStatus.IN_PROGRESS);
        test.setAnswers(new HashSet<>(Arrays.asList(answer1, answer2)));

        TestResultResponse expectedResponse = new TestResultResponse(testId, mockTechnology.getName(),
                TestStatus.COMPLETED, new BigDecimal("5.00"), 2, 1L, test.getCompletedAt());

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        when(testRepository.save(test)).thenAnswer(invocation -> invocation.getArgument(0));
        when(testMapper.toTestResultResponse(any(com.gemstoneseekers.models.Test.class))).thenReturn(expectedResponse);

        TestResultResponse actual = testApplicationService.submitTest(testId, userEmail);

        assertThat(actual).isEqualTo(expectedResponse);
        assertThat(test.getStatus()).isEqualTo(TestStatus.COMPLETED);
        assertThat(test.getScore()).isEqualByComparingTo("5.00");
        assertThat(test.getCompletedAt()).isNotNull();
    }

    @Test
    @DisplayName("submitTest should throw AccessDeniedException when candidate does not own the test")
    void submitTest_shouldThrowAccessDeniedException_whenCandidateDoesNotOwnTest() {
        String userEmail = "intruder@test.com";
        UUID testId = UUID.randomUUID();

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.IN_PROGRESS);

        Candidate intruder = new Candidate();
        intruder.setId(UUID.randomUUID());
        User user = new User();
        user.setEmail(userEmail);
        intruder.setUser(user);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(intruder);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> testApplicationService.submitTest(testId, userEmail))
                .isInstanceOf(AccessDeniedException.class).hasMessage("You do not have permission to submit this test");
    }

    @Test
    @DisplayName("submitTest should throw EntityNotFoundException when test is not found")
    void submitTest_shouldThrowEntityNotFoundException_whenTestNotFound() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> testApplicationService.submitTest(testId, userEmail))
                .isInstanceOf(EntityNotFoundException.class).hasMessage("Test with id " + testId + " not found");
    }

    @Test
    @DisplayName("getCandidateTestHistory should group tests and calculate averages")
    void getCandidateTestHistory_shouldGroupTestsAndCalculateAverages() {
        String userEmail = "candidate@test.com";
        Instant createdAt = Instant.parse("2026-08-13T18:00:00Z");

        com.gemstoneseekers.models.Test beginnerTest = new com.gemstoneseekers.models.Test();
        beginnerTest.setId(UUID.randomUUID());
        beginnerTest.setCandidate(mockCandidate);
        beginnerTest.setTechnology(mockTechnology);
        beginnerTest.setStatus(TestStatus.COMPLETED);
        beginnerTest.setScore(new BigDecimal("8.00"));
        beginnerTest.setCreatedAt(createdAt);
        beginnerTest.setCompletedAt(createdAt.plusSeconds(3600));

        Question beginnerQuestion = new Question();
        beginnerQuestion.setId(1L);
        beginnerQuestion.setDifficultyLevel(QuestionDifficulty.BEGINNER);
        CandidateAnswer beginnerAnswer = new CandidateAnswer();
        beginnerAnswer.setQuestion(beginnerQuestion);
        beginnerTest.setAnswers(new HashSet<>(Collections.singletonList(beginnerAnswer)));

        com.gemstoneseekers.models.Test advancedTest = new com.gemstoneseekers.models.Test();
        advancedTest.setId(UUID.randomUUID());
        advancedTest.setCandidate(mockCandidate);
        advancedTest.setTechnology(mockTechnology);
        advancedTest.setStatus(TestStatus.CANCELED);
        advancedTest.setScore(null);
        advancedTest.setCreatedAt(createdAt.plusSeconds(120));
        advancedTest.setCompletedAt(createdAt.plusSeconds(240));

        Question advancedQuestion = new Question();
        advancedQuestion.setId(2L);
        advancedQuestion.setDifficultyLevel(QuestionDifficulty.ADVANCED);
        CandidateAnswer advancedAnswer = new CandidateAnswer();
        advancedAnswer.setQuestion(advancedQuestion);
        advancedTest.setAnswers(new HashSet<>(Collections.singletonList(advancedAnswer)));

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findAll(any(Specification.class), any(Sort.class)))
                .thenReturn(Arrays.asList(beginnerTest, advancedTest));
        when(testMapper.toSummaryResponse(beginnerTest)).thenReturn(
                new TestSummaryResponse(beginnerTest.getId(), beginnerTest.getStatus(), QuestionDifficulty.BEGINNER,
                        beginnerTest.getScore(), createdAt, beginnerTest.getCompletedAt()));
        when(testMapper.toSummaryResponse(advancedTest)).thenReturn(
                new TestSummaryResponse(advancedTest.getId(), advancedTest.getStatus(), QuestionDifficulty.ADVANCED,
                        advancedTest.getScore(), advancedTest.getCreatedAt(), advancedTest.getCompletedAt()));

        CandidateTestHistoryResponse response = testApplicationService.getCandidateTestHistory(userEmail, null);

        assertThat(response.candidateId()).isEqualTo(mockCandidate.getId());
        assertThat(response.totalExecutedTests()).isEqualTo(2);
        assertThat(response.historyByTechnology()).hasSize(1);
        TechnologyHistoryGroupResponse technologyGroup = response.historyByTechnology().get(0);
        assertThat(technologyGroup.technologyName()).isEqualTo("Java");
        assertThat(technologyGroup.difficulties()).extracting(DifficultyHistoryGroupResponse::difficulty)
                .containsExactly(QuestionDifficulty.BEGINNER, QuestionDifficulty.ADVANCED);
        assertThat(technologyGroup.difficulties().get(0).averageScore()).isEqualByComparingTo("8.00");
        assertThat(technologyGroup.difficulties().get(1).averageScore()).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("getTestResult should return detailed result")
    void getTestResult_shouldReturnDetailedResult() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setTechnology(mockTechnology);
        test.setStatus(TestStatus.COMPLETED);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        TestDetailedResultResponse expected = new TestDetailedResultResponse(testId, mockTechnology.getName(),
                TestStatus.COMPLETED, QuestionDifficulty.BEGINNER, new BigDecimal("10.00"), 1, 1,
                Instant.parse("2026-08-13T18:30:00Z"), Collections.<QuestionResultResponse>emptyList());
        when(testMapper.toDetailedResultResponse(test)).thenReturn(expected);

        TestDetailedResultResponse response = testApplicationService.getTestResult(testId, userEmail);

        assertThat(response).isEqualTo(expected);
    }

    @Test
    @DisplayName("getTestResult should throw BusinessRuleException when test is in progress")
    void getTestResult_shouldThrowBusinessRuleException_whenTestIsInProgress() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.IN_PROGRESS);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> testApplicationService.getTestResult(testId, userEmail))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Cannot view detailed results for a test that is currently IN_PROGRESS");
    }

    @Test
    @DisplayName("getTestResult should throw AccessDeniedException when candidate does not own the test")
    void getTestResult_shouldThrowAccessDeniedException_whenCandidateDoesNotOwnTest() {
        String userEmail = "intruder@test.com";
        UUID testId = UUID.randomUUID();

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.COMPLETED);

        Candidate intruder = new Candidate();
        intruder.setId(UUID.randomUUID());
        User user = new User();
        user.setEmail(userEmail);
        intruder.setUser(user);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(intruder);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> testApplicationService.getTestResult(testId, userEmail))
                .isInstanceOf(AccessDeniedException.class).hasMessage("You do not have permission to view this test");
    }

    @Test
    @DisplayName("getTestResult should throw EntityNotFoundException when test is not found")
    void getTestResult_shouldThrowEntityNotFoundException_whenTestNotFound() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> testApplicationService.getTestResult(testId, userEmail))
                .isInstanceOf(EntityNotFoundException.class).hasMessage("Test with id " + testId + " not found");
    }

    @Test
    @DisplayName("cancelTest should cancel an in-progress test")
    void cancelTest_shouldCancelInProgressTest() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.IN_PROGRESS);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        when(testRepository.save(test)).thenAnswer(invocation -> invocation.getArgument(0));

        testApplicationService.cancelTest(testId, userEmail);

        assertThat(test.getStatus()).isEqualTo(TestStatus.CANCELED);
        assertThat(test.getCompletedAt()).isNotNull();
    }

    @Test
    @DisplayName("cancelTest should throw BusinessRuleException when test is not in progress")
    void cancelTest_shouldThrowBusinessRuleException_whenTestIsNotInProgress() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.COMPLETED);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> testApplicationService.cancelTest(testId, userEmail))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Cannot cancel test. Current status is COMPLETED, expected IN_PROGRESS");
    }

    @Test
    @DisplayName("cancelTest should throw AccessDeniedException when candidate does not own the test")
    void cancelTest_shouldThrowAccessDeniedException_whenCandidateDoesNotOwnTest() {
        String userEmail = "intruder@test.com";
        UUID testId = UUID.randomUUID();

        com.gemstoneseekers.models.Test test = new com.gemstoneseekers.models.Test();
        test.setId(testId);
        test.setCandidate(mockCandidate);
        test.setStatus(TestStatus.IN_PROGRESS);

        Candidate intruder = new Candidate();
        intruder.setId(UUID.randomUUID());
        User user = new User();
        user.setEmail(userEmail);
        intruder.setUser(user);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(intruder);
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> testApplicationService.cancelTest(testId, userEmail))
                .isInstanceOf(AccessDeniedException.class).hasMessage("You do not have permission to modify this test");
    }

    @Test
    @DisplayName("cancelTest should throw EntityNotFoundException when test is not found")
    void cancelTest_shouldThrowEntityNotFoundException_whenTestNotFound() {
        String userEmail = "candidate@test.com";
        UUID testId = UUID.randomUUID();

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(testRepository.findById(testId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> testApplicationService.cancelTest(testId, userEmail))
                .isInstanceOf(EntityNotFoundException.class).hasMessage("Test with id " + testId + " not found");
    }
}
