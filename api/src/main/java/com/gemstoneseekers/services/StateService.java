package com.gemstoneseekers.services;

import java.util.List;

import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.models.Country;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.gemstoneseekers.models.State;
import com.gemstoneseekers.repositories.StateRepository;

@Service
public class StateService {

    private final StateRepository stateRepository;

    public StateService(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    public List<State> getStates() {
        return stateRepository.findAll();
    }

    public List<State> getStatesByCountryId(Integer countryId) {
        return stateRepository.findByCountryId(countryId);
    }

    public State getCanonicalState(String name, Country country) {
        return stateRepository.findByNameIgnoreCaseAndCountryId(name, country.getId())
            .orElseThrow(() -> new EntityNotFoundException("State", name));
    }

}
