package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.CandidateResponse;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.models.Candidate;
import org.springframework.stereotype.Component;

@Component
public class CandidateMapper {

    private final UserMapper userMapper;
    private final CandidateLinkMapper candidateLinkMapper;
    private final ExperienceMapper experienceMapper;
    private final EducationMapper educationMapper;
    private final CertificationMapper certificationMapper;
    private final ProjectMapper projectMapper;
    private final CandidateLanguageMapper candidateLanguageMapper;

    public CandidateMapper(UserMapper userMapper, CandidateLinkMapper candidateLinkMapper,
            ExperienceMapper experienceMapper, EducationMapper educationMapper, CertificationMapper certificationMapper,
            ProjectMapper projectMapper, CandidateLanguageMapper candidateLanguageMapper) {
        this.userMapper = userMapper;
        this.candidateLinkMapper = candidateLinkMapper;
        this.experienceMapper = experienceMapper;
        this.educationMapper = educationMapper;
        this.certificationMapper = certificationMapper;
        this.projectMapper = projectMapper;
        this.candidateLanguageMapper = candidateLanguageMapper;
    }

    public CandidateResponse toCandidateResponse(Candidate candidate) {
        UserResponse userResponse = userMapper.toUserResponse(candidate.getUser());

        return new CandidateResponse(candidate.getId(), userResponse, candidate.getPhone(), candidate.getSummary(),
                candidateLinkMapper.toResponseList(candidate.getLinks()),
                experienceMapper.toResponseList(candidate.getExperiences()),
                educationMapper.toResponseList(candidate.getEducations()),
                certificationMapper.toResponseList(candidate.getCertifications()),
                projectMapper.toResponseList(candidate.getProjects()),
                candidateLanguageMapper.toResponseList(candidate.getLanguages()));
    }

    public void updateEntityFromRequest(UserRequest request, Candidate candidate) {

        if (request == null || candidate == null) {
            return;
        }

        if (request.phone() != null && !request.phone().isBlank()) {
            candidate.setPhone(request.phone());
        }
        if (request.summary() != null && !request.summary().isBlank()) {
            candidate.setSummary(request.summary());
        }
    }
}
