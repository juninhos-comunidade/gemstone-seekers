package com.gemstoneseekers.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.JobTechnology;
import com.gemstoneseekers.models.JobTechnologyId;

public interface JobTechnologyRepository extends JpaRepository<JobTechnology, JobTechnologyId> {
    List<JobTechnology> findByJob_Id(UUID jobId);
    Optional<JobTechnology> findByJob_IdAndTechnology_Id(UUID jobId, Long technologyId);
    boolean existsByJob_IdAndTechnology_Id(UUID jobId, Long technologyId);
    void deleteByJob_IdAndTechnology_Id(UUID jobId, Long technologyId);
}
