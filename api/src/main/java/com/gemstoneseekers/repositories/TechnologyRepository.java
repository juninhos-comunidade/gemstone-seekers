package com.gemstoneseekers.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gemstoneseekers.models.Technology;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TechnologyRepository extends JpaRepository<Technology, Integer> {
    Optional<Technology> findByName(String name);
}
