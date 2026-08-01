package com.gemstoneseekers.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Job;

public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByDeletedAtIsNull();

    Optional<Job> findByIdAndDeletedAtIsNull(UUID id);
}
