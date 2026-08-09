package com.gemstoneseekers.services;

import java.util.List;

import com.gemstoneseekers.exceptions.EntityNotFoundException;
import org.springframework.stereotype.Service;

import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.repositories.TechnologyRepository;

@Service
public class TechnologyService {

    private final TechnologyRepository technologyRepository;

    public TechnologyService(TechnologyRepository technologyRepository) {
        this.technologyRepository = technologyRepository;
    }

    public List<Technology> getTechnologies() {
        return technologyRepository.findAll();
    }

    public Technology getTechnologyByName(String technologyName){
        return technologyRepository.findByName(technologyName)
                .orElseThrow(() -> new EntityNotFoundException("Technology", technologyName));
    }
}
