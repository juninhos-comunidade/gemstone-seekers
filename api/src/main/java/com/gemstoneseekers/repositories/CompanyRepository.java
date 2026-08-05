package com.gemstoneseekers.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Company;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
    List<Company> findByDeletedAtIsNull();

    Optional<Company> findByIdAndDeletedAtIsNull(UUID id);

    boolean existsByCnpjAndDeletedAtIsNull(String cnpj);
}
