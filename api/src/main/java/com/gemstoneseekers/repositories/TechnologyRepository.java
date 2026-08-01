package com.gemstoneseekers.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Technology;

public interface TechnologyRepository extends JpaRepository<Technology, Long> {
    Optional<Technology> findByName(String name);
    boolean existsByName(String name);
}
