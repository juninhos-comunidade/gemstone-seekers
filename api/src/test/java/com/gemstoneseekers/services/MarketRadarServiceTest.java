package com.gemstoneseekers.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.gemstoneseekers.dtos.response.TechnologyDemandResponse;
import com.gemstoneseekers.enums.JobStatus;
import com.gemstoneseekers.mappers.MarketRadarMapper;
import com.gemstoneseekers.repositories.JobTechnologyRepository;
import com.gemstoneseekers.repositories.projections.TechnologyDemandProjection;

class MarketRadarServiceTest {

    private final JobTechnologyRepository jobTechnologyRepository = mock(JobTechnologyRepository.class);
    private final MarketRadarMapper marketRadarMapper = mock(MarketRadarMapper.class);
    private final MarketRadarService marketRadarService = new MarketRadarService(jobTechnologyRepository,
            marketRadarMapper);

    @Test
    void getTechnologyDemandShouldReturnMappedResponsesWhenDataExists() {
        TechnologyDemandProjection projection = mock(TechnologyDemandProjection.class);
        TechnologyDemandResponse response = new TechnologyDemandResponse(1, "Java", "Backend", 5L, 3L);

        when(jobTechnologyRepository.findTechnologyDemandByJobStatus(JobStatus.OPEN)).thenReturn(List.of(projection));
        when(marketRadarMapper.toResponseList(List.of(projection))).thenReturn(List.of(response));

        List<TechnologyDemandResponse> result = marketRadarService.getTechnologyDemand();

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().technologyId()).isEqualTo(1);
        assertThat(result.getFirst().technologyName()).isEqualTo("Java");
        assertThat(result.getFirst().technologyCategory()).isEqualTo("Backend");
        assertThat(result.getFirst().jobCount()).isEqualTo(5L);
        assertThat(result.getFirst().mandatoryCount()).isEqualTo(3L);

        verify(jobTechnologyRepository).findTechnologyDemandByJobStatus(JobStatus.OPEN);
        verify(marketRadarMapper).toResponseList(List.of(projection));
        verifyNoMoreInteractions(jobTechnologyRepository, marketRadarMapper);
    }

    @Test
    void getTechnologyDemandShouldReturnEmptyListWhenNoDataExists() {
        when(jobTechnologyRepository.findTechnologyDemandByJobStatus(JobStatus.OPEN)).thenReturn(List.of());
        when(marketRadarMapper.toResponseList(List.of())).thenReturn(List.of());

        List<TechnologyDemandResponse> result = marketRadarService.getTechnologyDemand();

        assertThat(result).isEmpty();

        verify(jobTechnologyRepository).findTechnologyDemandByJobStatus(JobStatus.OPEN);
        verify(marketRadarMapper).toResponseList(List.of());
        verifyNoMoreInteractions(jobTechnologyRepository, marketRadarMapper);
    }
}
