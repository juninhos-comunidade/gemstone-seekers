package com.gemstoneseekers.services;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gemstoneseekers.dtos.response.CountryResponse;
import com.gemstoneseekers.models.Country;
import com.gemstoneseekers.repositories.CountryRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CountryServiceTest {

    @Mock
    private CountryRepository countryRepository;

    @InjectMocks
    private CountryService countryService;

    @Test
    void shouldReturnAllCountriesAsResponse() {
        Country country1 = new Country();
        country1.setId(1);
        country1.setName("Brazil");
        country1.setCodeAlpha2("BR");

        Country country2 = new Country();
        country2.setId(2);
        country2.setName("United States");
        country2.setCodeAlpha2("US");

        when(countryRepository.findAll()).thenReturn(List.of(country1, country2));

        List<CountryResponse> result = countryService.getCountries();

        assertThat(result).hasSize(2);
        assertThat(result.getFirst().id()).isEqualTo(1);
        assertThat(result.getFirst().name()).isEqualTo("Brazil");
        assertThat(result.getFirst().codeAlpha2()).isEqualTo("BR");
        assertThat(result.get(1).id()).isEqualTo(2);
        assertThat(result.get(1).name()).isEqualTo("United States");
        assertThat(result.get(1).codeAlpha2()).isEqualTo("US");
        verify(countryRepository).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoCountries() {
        when(countryRepository.findAll()).thenReturn(List.of());

        List<CountryResponse> result = countryService.getCountries();

        assertThat(result).isEmpty();
        verify(countryRepository).findAll();
    }
}
