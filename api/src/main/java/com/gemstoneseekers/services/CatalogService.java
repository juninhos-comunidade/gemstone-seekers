package com.gemstoneseekers.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.repositories.TechnologyRepository;

@Service
public class CatalogService {

    private final TechnologyRepository technologyRepository;

    public CatalogService(TechnologyRepository technologyRepository) {
        this.technologyRepository = technologyRepository;
    }

    public List<TechnologyResponse> getTechnologies() {
        List<Technology> technologies = technologyRepository.findAll();
        return technologies.stream()
            .map(t -> new TechnologyResponse(t.getId(), t.getName(), t.getCategory()))
            .toList();
    }
}
