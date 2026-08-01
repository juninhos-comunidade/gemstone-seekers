package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.CityResponse;
import com.gemstoneseekers.models.City;

@Component
public class CityMapper {
    public CityResponse toCityResponse(City city) {
        return new CityResponse(city.getId(), city.getName(), city.getState().getId());
    }
}
