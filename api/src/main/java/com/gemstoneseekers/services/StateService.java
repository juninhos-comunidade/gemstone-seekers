package com.gemstoneseekers.services;

import java.util.List;

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
}
