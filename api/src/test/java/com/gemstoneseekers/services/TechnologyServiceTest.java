package com.gemstoneseekers.services;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.repositories.TechnologyRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TechnologyServiceTest {

    @Mock
    private TechnologyRepository technologyRepository;

    @InjectMocks
    private TechnologyService technologyService;

    @Test
    void shouldReturnAllTechnologiesAsResponse() {
        Technology tech1 = new Technology();
        tech1.setId(1);
        tech1.setName("Java");
        tech1.setCategory("Programming Language");

        Technology tech2 = new Technology();
        tech2.setId(2);
        tech2.setName("React");
        tech2.setCategory("Frontend Framework");

        when(technologyRepository.findAll()).thenReturn(List.of(tech1, tech2));

        List<TechnologyResponse> result = technologyService.getTechnologies();

        assertThat(result).hasSize(2);
        assertThat(result.getFirst().id()).isEqualTo(1);
        assertThat(result.getFirst().name()).isEqualTo("Java");
        assertThat(result.getFirst().category()).isEqualTo("Programming Language");
        assertThat(result.get(1).id()).isEqualTo(2);
        assertThat(result.get(1).name()).isEqualTo("React");
        assertThat(result.get(1).category()).isEqualTo("Frontend Framework");
        verify(technologyRepository).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoTechnologies() {
        when(technologyRepository.findAll()).thenReturn(List.of());

        List<TechnologyResponse> result = technologyService.getTechnologies();

        assertThat(result).isEmpty();
        verify(technologyRepository).findAll();
    }
}
