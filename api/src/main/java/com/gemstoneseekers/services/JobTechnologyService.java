package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.JobTechnologyRequest;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Job;
import com.gemstoneseekers.models.JobTechnology;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.repositories.JobRepository;
import com.gemstoneseekers.repositories.JobTechnologyRepository;
import com.gemstoneseekers.repositories.TechnologyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class JobTechnologyService {

    private final JobTechnologyRepository jobTechnologyRepository;
    private final JobRepository jobRepository;
    private final TechnologyRepository technologyRepository;

    public JobTechnologyService(JobTechnologyRepository jobTechnologyRepository, JobRepository jobRepository,
            TechnologyRepository technologyRepository) {
        this.jobTechnologyRepository = jobTechnologyRepository;
        this.jobRepository = jobRepository;
        this.technologyRepository = technologyRepository;
    }

    public JobTechnology addTechnology(UUID jobId, JobTechnologyRequest request) {
        Job job = jobRepository.findByIdAndDeletedAtIsNull(jobId).orElseThrow(() -> new EntityNotFoundException("Job",
                jobId));

        Technology technology = technologyRepository.findById(request.technologyId()).orElseThrow(
                () -> new EntityNotFoundException("Technology", request.technologyId()));

        if (jobTechnologyRepository.existsByJobIdAndTechnologyId(jobId, request.technologyId())) {
            throw new ConflictException("Technology is already linked to this job");
        }

        boolean isMandatory = request.isMandatory() == null || request.isMandatory();

        JobTechnology jobTechnology = new JobTechnology(job, technology, isMandatory);

        return jobTechnologyRepository.save(jobTechnology);
    }

    @Transactional
    public void removeTechnology(UUID jobId, Integer technologyId) {
        JobTechnology jobTechnology = jobTechnologyRepository.findByJobIdAndTechnologyId(jobId, technologyId)
                .orElseThrow(() -> new EntityNotFoundException("JobTechnology", jobId + "/" + technologyId));

        jobTechnologyRepository.delete(jobTechnology);
    }

    public List<JobTechnology> findByJobId(UUID jobId) {
        return jobTechnologyRepository.findByJobId(jobId);
    }
}
