package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Integer> {
    Optional<Country> findByNameIgnoreCase(String countryName);
}
