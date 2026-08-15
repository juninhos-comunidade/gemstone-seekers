package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.response.CandidateAssessmentHistoryResponse;
import com.gemstoneseekers.dtos.response.DifficultyHistoryGroupResponse;
import com.gemstoneseekers.dtos.response.QuestionResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentDetailedResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentResponse;
import com.gemstoneseekers.dtos.response.AssessmentResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentSummaryResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.dtos.response.TechnologyHistoryGroupResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.AssessmentStatus;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.AssessmentMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.QuestionOption;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.QuestionOptionRepository;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.AssessmentRepository;
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
    private AssessmentApplicationService assessmentApplicationService;

    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private AssessmentRepository assessmentRepository;
    @Mock
    private CandidateService candidateService;
    @Mock
    private TechnologyService technologyService;
    @Mock
    private AssessmentMapper assessmentMapper;
    @Mock
    private QuestionOptionRepository questionOptionRepository;

    @Captor
    private ArgumentCaptor<com.gemstoneseekers.models.Assessment> testArgumentCaptor;

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
    @DisplayName("startAssessment should create a new test when no test is in progress")
    void startAssessment_shouldCreateNewTest_whenNoTestIsInProgress() {
        String userEmail = "candidate@test.com";
        String technologyName = "Java";
        QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;
        int requiredAmount = 10;

        List<Question> mockQuestions = LongStream.rangeClosed(1, requiredAmount).mapToObj(id -> {
            Question q = new Question();
            q.setId(id);
            return q;
        }).collect(Collectors.toList());

        AssessmentResponse expectedResponse = new AssessmentResponse(UUID.randomUUID(), new TechnologyResponse(
                mockTechnology.getId(), mockTechnology.getName(), mockTechnology.getCategory()),
                AssessmentStatus.IN_PROGRESS, Collections.emptyList());

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(technologyService.getTechnologyByName(technologyName)).thenReturn(mockTechnology);
        when(assessmentRepository.findByCandidateIdAndTechnologyNameAndStatus(mockCandidate.getId(), technologyName,
                AssessmentStatus.IN_PROGRESS)).thenReturn(Optional.empty());
        when(questionRepository.findUnansweredRandomByTechnologyAndDifficulty(technologyName, difficulty, mockCandidate
                .getId(), requiredAmount)).thenReturn(mockQuestions);
        when(assessmentRepository.save(any(com.gemstoneseekers.models.Assessment.class))).thenAnswer(
                invocation -> invocation.getArgument(0));
        when(assessmentMapper.toAssessmentAndQuestionsResponse(any(com.gemstoneseekers.models.Assessment.class)))
                .thenReturn(expectedResponse);

        AssessmentResponse actualResponse = assessmentApplicationService.startAssessment(userEmail, technologyName,
                difficulty);

        assertThat(actualResponse).isEqualTo(expectedResponse);

        verify(assessmentRepository).save(testArgumentCaptor.capture());
        com.gemstoneseekers.models.Assessment savedTest = testArgumentCaptor.getValue();

        assertThat(savedTest.getCandidate()).isEqualTo(mockCandidate);
        assertThat(savedTest.getTechnology()).isEqualTo(mockTechnology);
        assertThat(savedTest.getStatus()).isEqualTo(AssessmentStatus.IN_PROGRESS);
        assertThat(savedTest.getAnswers()).hasSize(requiredAmount);
        assertThat(savedTest.getAnswers().stream().map(ca -> ca.getQuestion().getId()))
                .containsExactlyInAnyOrderElementsOf(mockQuestions.stream().map(Question::getId).collect(Collectors
                        .toSet()));
    }

    @Test
    @DisplayName("startAssessment should return in-progress test when one already exists")
    void startAssessment_shouldReturnInProgressTest_whenTestAlreadyExists() {

        String userEmail = "candidate@test.com";
        String technologyName = "Java";
        QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;

        com.gemstoneseekers.models.Assessment existingTest = new com.gemstoneseekers.models.Assessment();
        existingTest.setId(UUID.randomUUID());
        existingTest.setStatus(AssessmentStatus.IN_PROGRESS);
        existingTest.setCandidate(mockCandidate);
        existingTest.setTechnology(mockTechnology);

        AssessmentResponse expectedResponse = new AssessmentResponse(existingTest.getId(), new TechnologyResponse(
                mockTechnology.getId(), mockTechnology.getName(), mockTechnology.getCategory()),
                AssessmentStatus.IN_PROGRESS, Collections.emptyList());

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(technologyService.getTechnologyByName(technologyName)).thenReturn(mockTechnology);
        when(assessmentRepository.findByCandidateIdAndTechnologyNameAndStatus(mockCandidate.getId(), technologyName,
                AssessmentStatus.IN_PROGRESS)).thenReturn(Optional.of(existingTest));
        when(assessmentMapper.toAssessmentAndQuestionsResponse(existingTest)).thenReturn(expectedResponse);

        AssessmentResponse actualResponse = assessmentApplicationService.startAssessment(userEmail, technologyName,
                difficulty);

        assertThat(actualResponse).isEqualTo(expectedResponse);
        verify(questionRepository, never()).findUnansweredRandomByTechnologyAndDifficulty(anyString(), any(), any(
                UUID.class), anyInt());
        verify(assessmentRepository, never()).save(any(com.gemstoneseekers.models.Assessment.class));
    }

    @Test
    @DisplayName("startAssessment should throw BusinessRuleException when no questions are found")
    void startAssessment_shouldThrowBusinessRuleException_whenNoQuestionsAreFound() {

        String userEmail = "candidate@test.com";
        String technologyName = "Java";
        QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;
        int requiredAmount = 10;

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(technologyService.getTechnologyByName(technologyName)).thenReturn(mockTechnology);
        when(assessmentRepository.findByCandidateIdAndTechnologyNameAndStatus(mockCandidate.getId(), technologyName,
                AssessmentStatus.IN_PROGRESS)).thenReturn(Optional.empty());
        when(questionRepository.findUnansweredRandomByTechnologyAndDifficulty(technologyName, difficulty, mockCandidate
                .getId(), requiredAmount)).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> assessmentApplicationService.startAssessment(userEmail, technologyName, difficulty))
                .isInstanceOf(BusinessRuleException.class).hasMessage(
                        "No questions found for technology 'Java' with difficulty 'BEGINNER'");

        verify(assessmentRepository, never()).save(any(com.gemstoneseekers.models.Assessment.class));
    }

    @Test
    @DisplayName("saveCandidateAnswer should save the selected option for the given question")
    void saveCandidateAnswer_shouldSaveSelectedOption() {

        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();
        Long questionId = 1L;
        Long selectedOptionId = 101L;

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.IN_PROGRESS);

        Question question = new Question();
        question.setId(questionId);

        CandidateAnswer candidateAnswer = new CandidateAnswer();
        candidateAnswer.setAssessment(test);
        candidateAnswer.setQuestion(question);
        test.setAnswers(new HashSet<>(Collections.singletonList(candidateAnswer)));

        QuestionOption selectedOption = new QuestionOption();
        selectedOption.setId(selectedOptionId);
        selectedOption.setQuestion(question);

        SaveAnswerRequest request = new SaveAnswerRequest(questionId, selectedOptionId);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));
        when(questionOptionRepository.findById(selectedOptionId)).thenReturn(Optional.of(selectedOption));

        assessmentApplicationService.saveCandidateAnswer(assessmentId, questionId, request, userEmail);

        Optional<CandidateAnswer> answerOptional = test.getAnswers().stream().filter(a -> a.getQuestion().getId()
                .equals(questionId)).findFirst();

        assertThat(answerOptional).isPresent();
        assertThat(answerOptional.get().getSelectedOption()).isEqualTo(selectedOption);
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw EntityNotFoundException when test is not found")
    void saveCandidateAnswer_shouldThrowEntityNotFoundException_whenTestNotFound() {

        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();
        Long questionId = 1L;
        SaveAnswerRequest request = new SaveAnswerRequest(questionId, 101L);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assessmentApplicationService.saveCandidateAnswer(assessmentId, questionId, request,
                userEmail)).isInstanceOf(EntityNotFoundException.class).hasMessage("Test with id " + assessmentId
                        + " not found");
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw AccessDeniedException when candidate does not own the test")
    void saveCandidateAnswer_shouldThrowAccessDeniedException_whenCandidateDoesNotOwnTest() {

        String userEmail = "attacker@test.com";
        UUID assessmentId = UUID.randomUUID();
        Long questionId = 1L;
        SaveAnswerRequest request = new SaveAnswerRequest(questionId, 101L);

        Candidate attacker = new Candidate();
        attacker.setId(UUID.randomUUID());
        User attackerUser = new User();
        attackerUser.setEmail(userEmail);
        attacker.setUser(attackerUser);

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(attacker);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> assessmentApplicationService.saveCandidateAnswer(assessmentId, questionId, request,
                userEmail)).isInstanceOf(AccessDeniedException.class).hasMessage(
                        "You do not have permission to modify this test");
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw EntityNotFoundException when selected option is not found")
    void saveCandidateAnswer_shouldThrowEntityNotFoundException_whenSelectedOptionNotFound() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();
        Long questionId = 1L;
        Long selectedOptionId = 101L;

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.IN_PROGRESS);

        Question question = new Question();
        question.setId(questionId);
        CandidateAnswer candidateAnswer = new CandidateAnswer();
        candidateAnswer.setAssessment(test);
        candidateAnswer.setQuestion(question);
        test.setAnswers(new HashSet<>(Collections.singletonList(candidateAnswer)));

        SaveAnswerRequest request = new SaveAnswerRequest(questionId, selectedOptionId);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));
        when(questionOptionRepository.findById(selectedOptionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assessmentApplicationService.saveCandidateAnswer(assessmentId, questionId, request,
                userEmail)).isInstanceOf(EntityNotFoundException.class).hasMessage(
                        "QuestionOption with id 101 not found");
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw BusinessRuleException when test is not in progress")
    void saveCandidateAnswer_shouldThrowBusinessRuleException_whenTestIsNotInProgress() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();
        Long questionId = 1L;
        SaveAnswerRequest request = new SaveAnswerRequest(questionId, 101L);

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.COMPLETED);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> assessmentApplicationService.saveCandidateAnswer(assessmentId, questionId, request,
                userEmail)).isInstanceOf(BusinessRuleException.class).hasMessage(
                        "Cannot save answers for a test that is not IN_PROGRESS");
    }

    @Test
    @DisplayName("saveCandidateAnswer should throw BusinessRuleException when option does not belong to question")
    void saveCandidateAnswer_shouldThrowBusinessRuleException_whenOptionDoesNotBelongToQuestion() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();
        Long questionId = 1L;
        Long otherQuestionId = 2L;
        Long selectedOptionId = 101L;

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.IN_PROGRESS);

        Question testQuestion = new Question();
        testQuestion.setId(questionId);
        CandidateAnswer candidateAnswer = new CandidateAnswer();
        candidateAnswer.setAssessment(test);
        candidateAnswer.setQuestion(testQuestion);
        test.setAnswers(new HashSet<>(Collections.singletonList(candidateAnswer)));

        QuestionOption selectedOption = new QuestionOption();
        selectedOption.setId(selectedOptionId);
        Question otherQuestion = new Question();
        otherQuestion.setId(otherQuestionId);
        selectedOption.setQuestion(otherQuestion);

        SaveAnswerRequest request = new SaveAnswerRequest(questionId, selectedOptionId);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));
        when(questionOptionRepository.findById(selectedOptionId)).thenReturn(Optional.of(selectedOption));

        assertThatThrownBy(() -> assessmentApplicationService.saveCandidateAnswer(assessmentId, questionId, request,
                userEmail)).isInstanceOf(BusinessRuleException.class).hasMessage(
                        "Option ID 101 does not belong to Question ID 1");
    }

    @Test
    @DisplayName("submitAssessment should complete test and return result")
    void submitAssessment_shouldCompleteTestAndReturnResult() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();

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

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setTechnology(mockTechnology);
        test.setStatus(AssessmentStatus.IN_PROGRESS);
        test.setAnswers(new HashSet<>(Arrays.asList(answer1, answer2)));

        AssessmentResultResponse expectedResponse = new AssessmentResultResponse(assessmentId, mockTechnology.getName(),
                AssessmentStatus.COMPLETED, new BigDecimal("5.00"), 2, 1L, test.getCompletedAt());

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));
        when(assessmentRepository.save(test)).thenAnswer(invocation -> invocation.getArgument(0));
        when(assessmentMapper.toAssessmentResultResponse(any(com.gemstoneseekers.models.Assessment.class))).thenReturn(
                expectedResponse);

        AssessmentResultResponse actual = assessmentApplicationService.submitAssessment(assessmentId, userEmail);

        assertThat(actual).isEqualTo(expectedResponse);
        assertThat(test.getStatus()).isEqualTo(AssessmentStatus.COMPLETED);
        assertThat(test.getScore()).isEqualByComparingTo("5.00");
        assertThat(test.getCompletedAt()).isNotNull();
    }

    @Test
    @DisplayName("submitAssessment should throw AccessDeniedException when candidate does not own the test")
    void submitAssessment_shouldThrowAccessDeniedException_whenCandidateDoesNotOwnTest() {
        String userEmail = "intruder@test.com";
        UUID assessmentId = UUID.randomUUID();

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.IN_PROGRESS);

        Candidate intruder = new Candidate();
        intruder.setId(UUID.randomUUID());
        User user = new User();
        user.setEmail(userEmail);
        intruder.setUser(user);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(intruder);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> assessmentApplicationService.submitAssessment(assessmentId, userEmail)).isInstanceOf(
                AccessDeniedException.class).hasMessage("You do not have permission to submit this test");
    }

    @Test
    @DisplayName("submitAssessment should throw EntityNotFoundException when test is not found")
    void submitAssessment_shouldThrowEntityNotFoundException_whenTestNotFound() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assessmentApplicationService.submitAssessment(assessmentId, userEmail)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Test with id " + assessmentId + " not found");
    }

    @Test
    @DisplayName("getCandidateTestHistory should group tests and calculate averages")
    void getCandidateTestHistory_shouldGroupTestsAndCalculateAverages() {
        String userEmail = "candidate@test.com";
        Instant createdAt = Instant.parse("2026-08-13T18:00:00Z");

        com.gemstoneseekers.models.Assessment beginnerTest = new com.gemstoneseekers.models.Assessment();
        beginnerTest.setId(UUID.randomUUID());
        beginnerTest.setCandidate(mockCandidate);
        beginnerTest.setTechnology(mockTechnology);
        beginnerTest.setStatus(AssessmentStatus.COMPLETED);
        beginnerTest.setScore(new BigDecimal("8.00"));
        beginnerTest.setCreatedAt(createdAt);
        beginnerTest.setCompletedAt(createdAt.plusSeconds(3600));

        Question beginnerQuestion = new Question();
        beginnerQuestion.setId(1L);
        beginnerQuestion.setDifficultyLevel(QuestionDifficulty.BEGINNER);
        CandidateAnswer beginnerAnswer = new CandidateAnswer();
        beginnerAnswer.setQuestion(beginnerQuestion);
        beginnerTest.setAnswers(new HashSet<>(Collections.singletonList(beginnerAnswer)));

        com.gemstoneseekers.models.Assessment advancedTest = new com.gemstoneseekers.models.Assessment();
        advancedTest.setId(UUID.randomUUID());
        advancedTest.setCandidate(mockCandidate);
        advancedTest.setTechnology(mockTechnology);
        advancedTest.setStatus(AssessmentStatus.CANCELED);
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
        when(assessmentRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(Arrays.asList(
                beginnerTest, advancedTest));
        when(assessmentMapper.toSummaryResponse(beginnerTest)).thenReturn(new AssessmentSummaryResponse(beginnerTest
                .getId(), beginnerTest.getStatus(), QuestionDifficulty.BEGINNER, beginnerTest.getScore(), createdAt,
                beginnerTest.getCompletedAt()));
        when(assessmentMapper.toSummaryResponse(advancedTest)).thenReturn(new AssessmentSummaryResponse(advancedTest
                .getId(), advancedTest.getStatus(), QuestionDifficulty.ADVANCED, advancedTest.getScore(), advancedTest
                        .getCreatedAt(), advancedTest.getCompletedAt()));

        CandidateAssessmentHistoryResponse response = assessmentApplicationService.getCandidateTestHistory(userEmail,
                null);

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
    @DisplayName("getAssessmentResult should return detailed result")
    void getAssessmentResult_shouldReturnDetailedResult() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setTechnology(mockTechnology);
        test.setStatus(AssessmentStatus.COMPLETED);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));

        AssessmentDetailedResultResponse expected = new AssessmentDetailedResultResponse(assessmentId, mockTechnology
                .getName(), AssessmentStatus.COMPLETED, QuestionDifficulty.BEGINNER, new BigDecimal("10.00"), 1, 1,
                Instant.parse("2026-08-13T18:30:00Z"), Collections.<QuestionResultResponse>emptyList());
        when(assessmentMapper.toDetailedResultResponse(test)).thenReturn(expected);

        AssessmentDetailedResultResponse response = assessmentApplicationService.getAssessmentResult(assessmentId,
                userEmail);

        assertThat(response).isEqualTo(expected);
    }

    @Test
    @DisplayName("getAssessmentResult should throw BusinessRuleException when test is in progress")
    void getAssessmentResult_shouldThrowBusinessRuleException_whenTestIsInProgress() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.IN_PROGRESS);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> assessmentApplicationService.getAssessmentResult(assessmentId, userEmail))
                .isInstanceOf(BusinessRuleException.class).hasMessage(
                        "Cannot view detailed results for a test that is currently IN_PROGRESS");
    }

    @Test
    @DisplayName("getAssessmentResult should throw AccessDeniedException when candidate does not own the test")
    void getAssessmentResult_shouldThrowAccessDeniedException_whenCandidateDoesNotOwnTest() {
        String userEmail = "intruder@test.com";
        UUID assessmentId = UUID.randomUUID();

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.COMPLETED);

        Candidate intruder = new Candidate();
        intruder.setId(UUID.randomUUID());
        User user = new User();
        user.setEmail(userEmail);
        intruder.setUser(user);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(intruder);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> assessmentApplicationService.getAssessmentResult(assessmentId, userEmail))
                .isInstanceOf(AccessDeniedException.class).hasMessage("You do not have permission to view this test");
    }

    @Test
    @DisplayName("getAssessmentResult should throw EntityNotFoundException when test is not found")
    void getAssessmentResult_shouldThrowEntityNotFoundException_whenTestNotFound() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assessmentApplicationService.getAssessmentResult(assessmentId, userEmail))
                .isInstanceOf(EntityNotFoundException.class).hasMessage("Test with id " + assessmentId + " not found");
    }

    @Test
    @DisplayName("cancelAssessment should cancel an in-progress test")
    void cancelAssessment_shouldCancelInProgressTest() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.IN_PROGRESS);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));
        when(assessmentRepository.save(test)).thenAnswer(invocation -> invocation.getArgument(0));

        assessmentApplicationService.cancelAssessment(assessmentId, userEmail);

        assertThat(test.getStatus()).isEqualTo(AssessmentStatus.CANCELED);
        assertThat(test.getCompletedAt()).isNotNull();
    }

    @Test
    @DisplayName("cancelAssessment should throw BusinessRuleException when test is not in progress")
    void cancelAssessment_shouldThrowBusinessRuleException_whenTestIsNotInProgress() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.COMPLETED);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> assessmentApplicationService.cancelAssessment(assessmentId, userEmail)).isInstanceOf(
                BusinessRuleException.class).hasMessage(
                        "Cannot cancel test. Current status is COMPLETED, expected IN_PROGRESS");
    }

    @Test
    @DisplayName("cancelAssessment should throw AccessDeniedException when candidate does not own the test")
    void cancelAssessment_shouldThrowAccessDeniedException_whenCandidateDoesNotOwnTest() {
        String userEmail = "intruder@test.com";
        UUID assessmentId = UUID.randomUUID();

        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(assessmentId);
        test.setCandidate(mockCandidate);
        test.setStatus(AssessmentStatus.IN_PROGRESS);

        Candidate intruder = new Candidate();
        intruder.setId(UUID.randomUUID());
        User user = new User();
        user.setEmail(userEmail);
        intruder.setUser(user);

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(intruder);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(test));

        assertThatThrownBy(() -> assessmentApplicationService.cancelAssessment(assessmentId, userEmail)).isInstanceOf(
                AccessDeniedException.class).hasMessage("You do not have permission to modify this test");
    }

    @Test
    @DisplayName("cancelAssessment should throw EntityNotFoundException when test is not found")
    void cancelAssessment_shouldThrowEntityNotFoundException_whenTestNotFound() {
        String userEmail = "candidate@test.com";
        UUID assessmentId = UUID.randomUUID();

        when(candidateService.getCandidateByEmailSession(userEmail)).thenReturn(mockCandidate);
        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assessmentApplicationService.cancelAssessment(assessmentId, userEmail)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Test with id " + assessmentId + " not found");
    }
}
