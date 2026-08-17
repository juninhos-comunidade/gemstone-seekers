package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.SaveAnswerRequest;
import com.gemstoneseekers.dtos.request.AssessmentHistoryFilterParams;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.dtos.response.CandidateAssessmentHistoryResponse;
import com.gemstoneseekers.dtos.response.DifficultyHistoryGroupResponse;
import com.gemstoneseekers.dtos.response.TechnologyHistoryGroupResponse;
import com.gemstoneseekers.dtos.response.AssessmentDetailedResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentResponse;
import com.gemstoneseekers.dtos.response.AssessmentResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentSummaryResponse;
import com.gemstoneseekers.enums.AssessmentStatus;
import com.gemstoneseekers.events.AssessmentCompletedEvent;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.AssessmentMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.Assessment;
import com.gemstoneseekers.models.QuestionOption;
import com.gemstoneseekers.repositories.QuestionOptionRepository;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.AssessmentRepository;

import com.gemstoneseekers.repositories.specifications.AssessmentSpecifications;
import org.springframework.context.ApplicationEventPublisher;
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
public class AssessmentApplicationService {
    private static final String ASSESSMENT_ENTITY_NAME = "Assessment";
    private final QuestionRepository questionRepository;
    private final AssessmentRepository assessmentRepository;
    private final CandidateService candidateService;
    private final TechnologyService technologyService;
    private final AssessmentMapper assessmentMapper;
    private final QuestionOptionRepository questionOptionRepository;
    private final ApplicationEventPublisher eventPublisher;

    private static final int REQUIRED_AMOUNT = 10;

    public AssessmentApplicationService(QuestionRepository questionRepository,
            AssessmentRepository assessmentRepository, CandidateService candidateService,
            TechnologyService technologyService, AssessmentMapper assessmentMapper,
            QuestionOptionRepository questionOptionRepository, ApplicationEventPublisher eventPublisher) {
        this.questionRepository = questionRepository;
        this.assessmentRepository = assessmentRepository;
        this.candidateService = candidateService;
        this.technologyService = technologyService;
        this.assessmentMapper = assessmentMapper;
        this.questionOptionRepository = questionOptionRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public AssessmentResponse startAssessment(String email, String technologyName, QuestionDifficulty difficulty) {

        Candidate candidate = candidateService.getCandidateByEmailSession(email);
        Technology technology = technologyService.getTechnologyByName(technologyName);

        Optional<Assessment> activeAssessment = assessmentRepository.findByCandidateIdAndTechnologyNameAndStatus(
                candidate.getId(), technologyName, AssessmentStatus.IN_PROGRESS);

        if (activeAssessment.isPresent()) {
            return assessmentMapper.toAssessmentAndQuestionsResponse(activeAssessment.get());
        }

        List<Question> questions = questionRepository.findUnansweredRandomByTechnologyAndDifficulty(technologyName,
                difficulty, candidate.getId(), REQUIRED_AMOUNT);

        if (questions.isEmpty()) {
            throw new BusinessRuleException(String.format("No questions found for technology '%s' with difficulty '%s'",
                    technologyName, difficulty));
        }
        Assessment newAssessment = new Assessment();
        newAssessment.setCandidate(candidate);
        newAssessment.setTechnology(technology);
        newAssessment.setStatus(AssessmentStatus.IN_PROGRESS);

        Set<CandidateAnswer> candidateAnswers = questions.stream().map(question -> {
            CandidateAnswer answer = new CandidateAnswer();
            answer.setAssessment(newAssessment);
            answer.setQuestion(question);
            return answer;
        }).collect(Collectors.toSet());

        newAssessment.setAnswers(candidateAnswers);

        Assessment savedAssessment = assessmentRepository.save(newAssessment);
        return assessmentMapper.toAssessmentAndQuestionsResponse(savedAssessment);
    }

    @Transactional
    public void saveCandidateAnswer(UUID assessmentId, Long questionId, SaveAnswerRequest request, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Assessment assessment = assessmentRepository.findById(assessmentId).orElseThrow(
                () -> new EntityNotFoundException(ASSESSMENT_ENTITY_NAME, assessmentId));

        if (!assessment.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this assessment");
        }

        if (assessment.getStatus() != AssessmentStatus.IN_PROGRESS) {
            throw new BusinessRuleException("Cannot save answers for a assessment that is not IN_PROGRESS");
        }

        QuestionOption selectedOption = questionOptionRepository.findById(request.selectedOptionId()).orElseThrow(
                () -> new EntityNotFoundException("QuestionOption", request.selectedOptionId()));

        if (!selectedOption.getQuestion().getId().equals(questionId)) {
            throw new BusinessRuleException(String.format("Option ID %d does not belong to Question ID %d", request
                    .selectedOptionId(), questionId));
        }

        assessment.answerQuestion(questionId, selectedOption);
    }

    @Transactional
    public AssessmentResultResponse submitAssessment(UUID assessmentId, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Assessment assessment = assessmentRepository.findById(assessmentId).orElseThrow(
                () -> new EntityNotFoundException(ASSESSMENT_ENTITY_NAME, assessmentId));

        if (!assessment.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to submit this assessment");
        }

        assessment.submit();

        Assessment savedAssessment = assessmentRepository.save(assessment);

        AssessmentCompletedEvent event = new AssessmentCompletedEvent(candidate.getId(), assessment.getTechnology()
                .getId(), assessment.getId(), assessment.getScore(), assessment.getDerivedDifficulty());
        eventPublisher.publishEvent(event);

        return assessmentMapper.toAssessmentResultResponse(savedAssessment);
    }

    @Transactional(readOnly = true)
    public CandidateAssessmentHistoryResponse getCandidateAssessmentHistory(String email,
            AssessmentHistoryFilterParams filters) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Specification<Assessment> specification = AssessmentSpecifications.withFilters(candidate.getId(), filters);

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        List<Assessment> filteredAssessments = assessmentRepository.findAll(specification, sort);

        Map<String, Map<QuestionDifficulty, List<Assessment>>> grouped = filteredAssessments.stream().collect(Collectors
                .groupingBy(assessment -> assessment.getTechnology().getName(), Collectors.groupingBy(
                        Assessment::getDerivedDifficulty)));

        List<TechnologyHistoryGroupResponse> historyByTechnology = grouped.entrySet().stream().map(techEntry -> {
            String techName = techEntry.getKey();
            Map<QuestionDifficulty, List<Assessment>> difficultyMap = techEntry.getValue();

            List<DifficultyHistoryGroupResponse> difficultyGroups = difficultyMap.entrySet().stream().map(diffEntry -> {
                QuestionDifficulty difficulty = diffEntry.getKey();
                List<Assessment> diffAssessments = diffEntry.getValue();

                List<AssessmentSummaryResponse> summaryList = diffAssessments.stream().map(
                        assessmentMapper::toSummaryResponse).toList();

                BigDecimal avgScore = calculateAverageScore(diffAssessments);

                return new DifficultyHistoryGroupResponse(difficulty, diffAssessments.size(), avgScore, summaryList);
            }).sorted(Comparator.comparing(d -> d.difficulty().ordinal())).toList();

            return new TechnologyHistoryGroupResponse(techName, difficultyGroups);
        }).toList();

        return new CandidateAssessmentHistoryResponse(candidate.getId(), filteredAssessments.size(),
                historyByTechnology);
    }

    private BigDecimal calculateAverageScore(List<Assessment> assessments) {
        List<Assessment> completedAssessments = assessments.stream().filter(t -> t.getScore() != null).toList();

        if (completedAssessments.isEmpty()) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal sum = completedAssessments.stream().map(Assessment::getScore).reduce(BigDecimal.ZERO,
                BigDecimal::add);

        return sum.divide(BigDecimal.valueOf(completedAssessments.size()), 2, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public AssessmentDetailedResultResponse getAssessmentResult(UUID assessmentId, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Assessment assessment = assessmentRepository.findById(assessmentId).orElseThrow(
                () -> new EntityNotFoundException(ASSESSMENT_ENTITY_NAME, assessmentId));

        if (!assessment.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to view this assessment");
        }

        if (assessment.getStatus() == AssessmentStatus.IN_PROGRESS) {
            throw new BusinessRuleException(
                    "Cannot view detailed results for a assessment that is currently IN_PROGRESS");
        }

        return assessmentMapper.toDetailedResultResponse(assessment);
    }

    @Transactional
    public void cancelAssessment(UUID assessmentId, String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        Assessment assessment = assessmentRepository.findById(assessmentId).orElseThrow(
                () -> new EntityNotFoundException(ASSESSMENT_ENTITY_NAME, assessmentId));

        if (!assessment.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this assessment");
        }

        if (assessment.getStatus() != AssessmentStatus.IN_PROGRESS) {
            throw new BusinessRuleException(String.format(
                    "Cannot cancel assessment. Current status is %s, expected IN_PROGRESS", assessment.getStatus()));
        }

        assessment.setStatus(AssessmentStatus.CANCELED);

        assessment.setCompletedAt(Instant.now());

        assessmentRepository.save(assessment);
    }

}
