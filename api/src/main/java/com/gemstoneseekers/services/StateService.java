package com.gemstoneseekers.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.response.StateResponse;
import com.gemstoneseekers.models.State;
import com.gemstoneseekers.repositories.StateRepository;

@Service
public class StateService {

    private final StateRepository stateRepository;

    public StateService(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    public List<StateResponse> getStates() {
        List<State> states = stateRepository.findAll();
        return states.stream().map(s -> new StateResponse(s.getId(), s.getName(), s.getCountry().getId())).toList();
    }

    public List<StateResponse> getStatesByCountryId(Integer countryId) {
        List<State> states = stateRepository.findByCountryId(countryId);
        return states.stream().map(s -> new StateResponse(s.getId(), s.getName(), s.getCountry().getId())).toList();
    }
}
