package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface ExperienceRepository extends JpaRepository<Experience, UUID> {

}
