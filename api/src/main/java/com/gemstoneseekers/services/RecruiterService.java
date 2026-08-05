package com.gemstoneseekers.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.request.RecruiterRequest;
import com.gemstoneseekers.exceptions.ConflictException;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CompanyRepository;
import com.gemstoneseekers.repositories.RecruiterRepository;
import com.gemstoneseekers.repositories.UserRepository;

@Service
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public RecruiterService(RecruiterRepository recruiterRepository, CompanyRepository companyRepository,
            UserRepository userRepository) {
        this.recruiterRepository = recruiterRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public Recruiter linkToCompany(UUID companyId, RecruiterRequest request) {
        Company company = companyRepository.findByIdAndDeletedAtIsNull(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company", companyId));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new EntityNotFoundException("User", request.userId()));

        if (recruiterRepository.existsByUserIdAndDeletedAtIsNull(request.userId())) {
            throw new ConflictException("User is already linked as a recruiter");
        }

        Recruiter recruiter = new Recruiter();
        recruiter.setUser(user);
        recruiter.setCompany(company);
        recruiter.setDepartment(request.department());
        return recruiterRepository.save(recruiter);
    }

    public List<Recruiter> findByCompanyId(UUID companyId) {
        return recruiterRepository.findByCompanyIdAndDeletedAtIsNull(companyId);
    }

    public Recruiter findById(UUID id) {
        return recruiterRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new EntityNotFoundException("Recruiter", id));
    }
}
