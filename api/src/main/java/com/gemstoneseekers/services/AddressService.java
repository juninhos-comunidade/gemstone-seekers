package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.dtos.response.CandidateResponse;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.AddressMapper;
import com.gemstoneseekers.models.Address;
import com.gemstoneseekers.repositories.AddressRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AddressService {
    AddressMapper addressMapper;
    AddressRepository addressRepository;
    public AddressService(AddressMapper addressMapper, AddressRepository addressRepository, CandidateRepository candidateRepository) {
        this.addressMapper = addressMapper;
        this.addressRepository = addressRepository;
    }
    public AddressResponse getAddressById(UUID id) {
        Address address = addressRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Address", id));
        return addressMapper.toAddressResponse(address);
    }
}
