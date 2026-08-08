package com.gemstoneseekers.services;

import java.util.List;

import com.gemstoneseekers.exceptions.EntityNotFoundException;
import org.springframework.stereotype.Service;

import com.gemstoneseekers.models.Country;
import com.gemstoneseekers.repositories.CountryRepository;

@Service
public class CountryService {

    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<Country> getCountries() {
        return countryRepository.findAll();
    }

    public Country getCountry(String name) {
        return countryRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new EntityNotFoundException("Country", name));
    }

}
