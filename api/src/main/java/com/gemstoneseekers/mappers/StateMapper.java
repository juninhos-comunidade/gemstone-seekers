package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.StateResponse;
import com.gemstoneseekers.models.State;

@Component
public class StateMapper {
    public StateResponse toStateResponse(State state) {
        return new StateResponse(state.getId(), state.getName(), state.getCountry().getId());
    }
}
