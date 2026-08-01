package com.gemstoneseekers.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Recruiter;

public interface RecruiterRepository extends JpaRepository<Recruiter, UUID> {
    Optional<Recruiter> findByUserId(UUID userId);

    List<Recruiter> findByCompanyIdAndDeletedAtIsNull(UUID companyId);

    Optional<Recruiter> findByIdAndDeletedAtIsNull(UUID id);

    boolean existsByUserIdAndDeletedAtIsNull(UUID userId);
}
