package com.gemstoneseekers.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.City;

public interface CityRepository extends JpaRepository<City, Integer> {
    List<City> findByStateId(Integer stateId);

    Optional<City> findByNameIgnoreCaseAndStateId(String cityName, Integer id);
}
