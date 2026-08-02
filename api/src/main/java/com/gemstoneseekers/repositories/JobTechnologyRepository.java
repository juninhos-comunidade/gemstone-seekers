package com.gemstoneseekers.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gemstoneseekers.enums.JobStatus;
import com.gemstoneseekers.models.JobTechnology;
import com.gemstoneseekers.models.JobTechnologyId;
import com.gemstoneseekers.repositories.projections.TechnologyDemandProjection;

public interface JobTechnologyRepository extends JpaRepository<JobTechnology, JobTechnologyId> {
    List<JobTechnology> findByJobId(UUID jobId);

    Optional<JobTechnology> findByJobIdAndTechnologyId(UUID jobId, Integer technologyId);

    boolean existsByJobIdAndTechnologyId(UUID jobId, Integer technologyId);

    void deleteByJobIdAndTechnologyId(UUID jobId, Integer technologyId);

    @Query("SELECT jt.technology.id AS technologyId, " + "jt.technology.name AS technologyName, "
            + "jt.technology.category AS technologyCategory, " + "COUNT(jt.job) AS jobCount, "
            + "SUM(CASE WHEN jt.isMandatory = true THEN 1 ELSE 0 END) AS mandatoryCount " + "FROM JobTechnology jt "
            + "WHERE jt.job.status = :status " + "AND jt.job.deletedAt IS NULL "
            + "AND jt.technology.deletedAt IS NULL "
            + "GROUP BY jt.technology.id, jt.technology.name, jt.technology.category " + "ORDER BY jobCount DESC")
    List<TechnologyDemandProjection> findTechnologyDemandByJobStatus(@Param("status") JobStatus status);
}
