package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.AddressRequest;
import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.AddressMapper;
import com.gemstoneseekers.models.*;
import com.gemstoneseekers.repositories.AddressRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AddressService {
    private final AddressMapper addressMapper;
    private final AddressRepository addressRepository;
    private final CandidateRepository candidateRepository;
    private final CountryService countryService;
    private final StateService stateService;
    private final CityService cityService;

    public AddressService(AddressMapper addressMapper, AddressRepository addressRepository, CandidateRepository candidateRepository, CountryService countryService, StateService stateService, CityService cityService) {
        this.addressMapper = addressMapper;
        this.addressRepository = addressRepository;
        this.candidateRepository = candidateRepository;
        this.countryService = countryService;
        this.stateService = stateService;
        this.cityService = cityService;
    }
    public AddressResponse getAddressById(UUID id) {
        Address address = addressRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Address", id));
        return addressMapper.toAddressResponse(address);
    }

    @Transactional
    public void updateAddresInfoByEmail(String email, AddressRequest request){

        Candidate candidate = candidateRepository.findByUserEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Candidate", email));

        Address address = candidate.getAddress();
        if (address == null) {
            address = new Address();
        }


        if (request.location() != null && request.location().city() != null && request.location().state() != null && request.location().country() != null) {
            Country country = countryService.getCountry(request.location().country());
            State state = stateService.getCanonicalState(request.location().state(), country);
            City city = cityService.getOrCreateCity(request.location().city(), state);

            address.setCity(city);
        }

        addressMapper.updateEntityFromRequest(request, address);

        addressRepository.save(address);
        candidate.setAddress(address);
        candidateRepository.save(candidate);

    }
}
