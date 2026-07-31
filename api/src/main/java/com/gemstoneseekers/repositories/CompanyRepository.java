package com.gemstoneseekers.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Company;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
}
