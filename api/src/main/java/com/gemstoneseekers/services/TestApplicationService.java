package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.TestMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.Test;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.TestRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TestApplicationService {

    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;
    private final CandidateService candidateService;
    private final TechnologyService technologyService;
    private final TestMapper testMapper;

    public TestApplicationService(QuestionRepository questionRepository,
                                  TestRepository testRepository,
                                  CandidateService candidateService,
                                  TechnologyService technologyService,
                                  TestMapper testMapper) {
        this.questionRepository = questionRepository;
        this.testRepository = testRepository;
        this.candidateService = candidateService;
        this.technologyService = technologyService;
        this.testMapper = testMapper;
    }
    @Transactional
    public TestResponse startTest(String email, String technologyName) {
        int requiredAmount = 10;
        Candidate candidate = candidateService.getCandidateByEmailSession(email);
        Technology technology = technologyService.getTechnologyByName(technologyName);

        Optional<Test> activeTest = testRepository.findByCandidateAndTechnologyAndStatus(
            candidate, technology, TestStatus.IN_PROGRESS
        );

        if (activeTest.isPresent()) {
            return testMapper.toTestAndQuestionsResponse(activeTest.get());
        }
        List<Question> selectedQuestions = questionRepository
            .findUnansweredRandomByTechnologyAndCandidate(technology.getId(), candidate.getId(), requiredAmount);

        Test test = new Test();
        test.setCandidate(candidate);
        test.setTechnology(technology);
        test.setStatus(TestStatus.IN_PROGRESS);

        for (Question question : selectedQuestions) {
            CandidateAnswer answer = new CandidateAnswer();
            answer.setQuestion(question);
            test.addAnswer(answer);
        }

        Test savedTest = testRepository.save(test);

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
}
