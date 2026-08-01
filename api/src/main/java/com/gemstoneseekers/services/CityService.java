package com.gemstoneseekers.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.response.CityResponse;
import com.gemstoneseekers.models.City;
import com.gemstoneseekers.repositories.CityRepository;

@Service
public class CityService {

    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public List<CityResponse> getCities() {
        List<City> cities = cityRepository.findAll();
        return cities.stream().map(c -> new CityResponse(c.getId(), c.getName(), c.getState().getId())).toList();
    }

    public List<CityResponse> getCitiesByStateId(Integer stateId) {
        List<City> cities = cityRepository.findByStateId(stateId);
        return cities.stream().map(c -> new CityResponse(c.getId(), c.getName(), c.getState().getId())).toList();
    }
}
