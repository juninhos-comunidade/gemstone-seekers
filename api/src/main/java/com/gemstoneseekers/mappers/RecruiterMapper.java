package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.RecruiterResponse;
import com.gemstoneseekers.models.Recruiter;

@Component
public class RecruiterMapper {

    public RecruiterResponse toRecruiterResponse(Recruiter recruiter) {
        return new RecruiterResponse(
            recruiter.getId(),
            recruiter.getUser().getId(),
            recruiter.getCompany().getId(),
            recruiter.getDepartment());
    }
}
