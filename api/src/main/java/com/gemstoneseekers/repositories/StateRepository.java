package com.gemstoneseekers.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.State;

public interface StateRepository extends JpaRepository<State, Integer> {
    List<State> findByCountryId(Integer countryId);

    Optional<State> findByNameIgnoreCaseAndCountryId(String stateName, Integer id);
}
