package com.gemstoneseekers.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Job;

public interface JobRepository extends JpaRepository<Job, UUID> {
}
