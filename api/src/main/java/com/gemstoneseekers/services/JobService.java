package com.gemstoneseekers.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.request.JobRequest;
import com.gemstoneseekers.enums.JobStatus;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Job;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.repositories.CompanyRepository;
import com.gemstoneseekers.repositories.JobRepository;
import com.gemstoneseekers.repositories.RecruiterRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;

    public JobService(JobRepository jobRepository, RecruiterRepository recruiterRepository,
            CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.recruiterRepository = recruiterRepository;
        this.companyRepository = companyRepository;
    }

    public Job create(JobRequest request) {
        Recruiter recruiter = recruiterRepository.findByIdAndDeletedAtIsNull(request.recruiterId()).orElseThrow(
                () -> new EntityNotFoundException("Recruiter", request.recruiterId()));

        Company company = companyRepository.findByIdAndDeletedAtIsNull(request.companyId()).orElseThrow(
                () -> new EntityNotFoundException("Company", request.companyId()));

        Job job = new Job();
        job.setRecruiter(recruiter);
        job.setCompany(company);
        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setSeniorityLevel(request.seniorityLevel());
        job.setDepartment(request.department());
        job.setSalaryMin(request.salaryMin());
        job.setSalaryMax(request.salaryMax());
        job.setStatus(JobStatus.OPEN);
        return jobRepository.save(job);
    }

    public List<Job> findAll() {
        return jobRepository.findByDeletedAtIsNull();
    }

    public Job findById(UUID id) {
        return jobRepository.findByIdAndDeletedAtIsNull(id).orElseThrow(() -> new EntityNotFoundException("Job", id));
    }

    public Job update(UUID id, JobRequest request) {
        Job job = findById(id);
        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setSeniorityLevel(request.seniorityLevel());
        job.setDepartment(request.department());
        job.setSalaryMin(request.salaryMin());
        job.setSalaryMax(request.salaryMax());
        return jobRepository.save(job);
    }

    public void delete(UUID id) {
        Job job = findById(id);
        job.setDeletedAt(Instant.now());
        jobRepository.save(job);
    }
}
