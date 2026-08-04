package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface EducationRepository extends JpaRepository<Education, UUID> {
}
