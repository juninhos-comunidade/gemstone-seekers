package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.JobResponse;
import com.gemstoneseekers.models.Job;

@Component
public class JobMapper {

    public JobResponse toJobResponse(Job job) {
        return new JobResponse(job.getId(), job.getTitle(), job.getDescription(), job.getSeniorityLevel(),
                job.getDepartment(), job.getSalaryMin(), job.getSalaryMax(), job.getStatus(),
                job.getRecruiter().getId(), job.getCompany().getId());
    }
}
