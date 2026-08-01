package com.gemstoneseekers.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Technology;

public interface TechnologyRepository extends JpaRepository<Technology, Integer> {
}
