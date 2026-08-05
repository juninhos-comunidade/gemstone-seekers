package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.CountryResponse;
import com.gemstoneseekers.models.Country;

@Component
public class CountryMapper {
    public CountryResponse toCountryResponse(Country country) {
        return new CountryResponse(country.getId(), country.getName(), country.getCodeAlpha2());
    }
}
