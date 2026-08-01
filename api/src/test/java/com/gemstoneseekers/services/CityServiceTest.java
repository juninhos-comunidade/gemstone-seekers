package com.gemstoneseekers.services;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gemstoneseekers.models.City;
import com.gemstoneseekers.models.State;
import com.gemstoneseekers.repositories.CityRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CityServiceTest {

    @Mock
    private CityRepository cityRepository;

    @InjectMocks
    private CityService cityService;

    @Test
    void shouldReturnAllCities() {
        State state = new State();
        state.setId(1);
        state.setName("São Paulo");

        City city1 = new City();
        city1.setId(1);
        city1.setState(state);
        city1.setName("São Paulo");

        City city2 = new City();
        city2.setId(2);
        city2.setState(state);
        city2.setName("Campinas");

        when(cityRepository.findAll()).thenReturn(List.of(city1, city2));

        List<City> result = cityService.getCities();

        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(city1, city2);
        verify(cityRepository).findAll();
    }

    @Test
    void shouldReturnCitiesByStateId() {
        State state = new State();
        state.setId(1);
        state.setName("São Paulo");

        City city1 = new City();
        city1.setId(1);
        city1.setState(state);
        city1.setName("São Paulo");

        when(cityRepository.findByStateId(1)).thenReturn(List.of(city1));

        List<City> result = cityService.getCitiesByStateId(1);

        assertThat(result).hasSize(1);
        assertThat(result).containsExactly(city1);
        verify(cityRepository).findByStateId(1);
    }

    @Test
    void shouldReturnEmptyListWhenNoCities() {
        when(cityRepository.findAll()).thenReturn(List.of());

        List<City> result = cityService.getCities();

        assertThat(result).isEmpty();
        verify(cityRepository).findAll();
    }
}
