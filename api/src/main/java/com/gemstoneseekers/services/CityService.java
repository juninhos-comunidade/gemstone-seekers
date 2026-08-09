package com.gemstoneseekers.services;

import java.util.List;

import com.gemstoneseekers.models.State;
import org.springframework.stereotype.Service;

import com.gemstoneseekers.models.City;
import com.gemstoneseekers.repositories.CityRepository;

@Service
public class CityService {

    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public List<City> getCities() {
        return cityRepository.findAll();
    }

    public List<City> getCitiesByStateId(Integer stateId) {
        return cityRepository.findByStateId(stateId);
    }

    public City getOrCreateCity(String cityName, State state) {
        return cityRepository.findByNameIgnoreCaseAndStateId(cityName, state.getId()).orElseGet(() -> {
            City city = new City();
            city.setName(cityName);
            city.setState(state);
            return cityRepository.save(city);
        });
    }

}
