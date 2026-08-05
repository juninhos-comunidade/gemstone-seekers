package com.gemstoneseekers.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, UUID> {
    Optional<Candidate> findByUserId(UUID userId);

    Optional<Candidate> findByUserEmail(String email);
}
