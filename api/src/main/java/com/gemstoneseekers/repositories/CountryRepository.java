package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Integer> {
}
