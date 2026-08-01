package com.gemstoneseekers.services;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gemstoneseekers.models.Country;
import com.gemstoneseekers.models.State;
import com.gemstoneseekers.repositories.StateRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StateServiceTest {

    @Mock
    private StateRepository stateRepository;

    @InjectMocks
    private StateService stateService;

    @Test
    void shouldReturnAllStates() {
        Country country = new Country();
        country.setId(1);
        country.setName("Brazil");
        country.setCodeAlpha2("BR");

        State state1 = new State();
        state1.setId(1);
        state1.setCountry(country);
        state1.setName("São Paulo");

        State state2 = new State();
        state2.setId(2);
        state2.setCountry(country);
        state2.setName("Rio de Janeiro");

        when(stateRepository.findAll()).thenReturn(List.of(state1, state2));

        List<State> result = stateService.getStates();

        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(state1, state2);
        verify(stateRepository).findAll();
    }

    @Test
    void shouldReturnStatesByCountryId() {
        Country country = new Country();
        country.setId(1);
        country.setName("Brazil");
        country.setCodeAlpha2("BR");

        State state1 = new State();
        state1.setId(1);
        state1.setCountry(country);
        state1.setName("São Paulo");

        when(stateRepository.findByCountryId(1)).thenReturn(List.of(state1));

        List<State> result = stateService.getStatesByCountryId(1);

        assertThat(result).hasSize(1);
        assertThat(result).containsExactly(state1);
        verify(stateRepository).findByCountryId(1);
    }

    @Test
    void shouldReturnEmptyListWhenNoStates() {
        when(stateRepository.findAll()).thenReturn(List.of());

        List<State> result = stateService.getStates();

        assertThat(result).isEmpty();
        verify(stateRepository).findAll();
    }
}
