package com.gemstoneseekers.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.JobTechnology;
import com.gemstoneseekers.models.JobTechnologyId;

public interface JobTechnologyRepository extends JpaRepository<JobTechnology, JobTechnologyId> {
    List<JobTechnology> findByJobId(UUID jobId);
    Optional<JobTechnology> findByJobIdAndTechnology_Id(UUID jobId, Integer technologyId);
    boolean existsByJobIdAndTechnologyId(UUID jobId, Integer technologyId);
    void deleteByJobIdAndTechnologyId(UUID jobId, Integer technologyId);
}
