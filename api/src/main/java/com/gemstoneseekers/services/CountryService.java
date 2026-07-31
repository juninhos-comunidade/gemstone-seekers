package com.gemstoneseekers.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.response.CountryResponse;
import com.gemstoneseekers.models.Country;
import com.gemstoneseekers.repositories.CountryRepository;

@Service
public class CountryService {

    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<CountryResponse> getCountries() {
        List<Country> countries = countryRepository.findAll();
        return countries.stream()
            .map(c -> new CountryResponse(c.getId(), c.getName(), c.getCodeAlpha2()))
            .toList();
    }
}
