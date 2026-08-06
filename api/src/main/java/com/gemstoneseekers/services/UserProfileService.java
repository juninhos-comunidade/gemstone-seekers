package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.AddressRequest;
import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.dtos.response.CandidateResponse;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.AddressMapper;
import com.gemstoneseekers.mappers.CandidateMapper;
import com.gemstoneseekers.mappers.CandidateProfileMapper;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.*;
import com.gemstoneseekers.repositories.AddressRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;


@Service
public class UserProfileService {
    private final AddressService addressService;
    private final CandidateMapper candidateMapper;
    private final CandidateProfileMapper candidateProfileMapper;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AddressMapper addressMapper;
    private final AddressRepository addressRepository;
    private final CandidateService candidateService;
    private final CountryService countryService;
    private final StateService stateService;
    private final CityService cityService;


    public UserProfileService(AddressService addressService, CandidateMapper candidateMapper, CandidateProfileMapper candidateProfileMapper, CandidateRepository candidateRepository, UserRepository userRepository, UserMapper userMapper, AddressMapper addressMapper, AddressRepository addressRepository, CandidateService candidateService, CountryService countryService, StateService stateService, CityService cityService) {
        this.addressService = addressService;
        this.candidateMapper = candidateMapper;
        this.candidateProfileMapper = candidateProfileMapper;
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.addressMapper = addressMapper;
        this.addressRepository = addressRepository;
        this.candidateService = candidateService;
        this.countryService = countryService;
        this.stateService = stateService;
        this.cityService = cityService;
    }


    public CandidateProfileResponse getCandidateProfileByUserEmail(String email) {

        Candidate candidateEntity = candidateRepository.findByUserEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Candidate for User", email));

        AddressResponse address = null;
        if (candidateEntity.getAddress() != null) {
            address = addressService.getAddressById(candidateEntity.getAddress().getId());
        }

        CandidateResponse candidate = candidateMapper.toCandidateResponse(candidateEntity);

        return candidateProfileMapper.toProfileResponse(candidate, address);
    }

    @Transactional
    public CandidateProfileResponse updatePersonalInfoByEmail(String email, UserRequest userRequest){

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User", email));
        Candidate candidate = candidateService.getCandidateByUserId(user.getId());

        userMapper.updateEntityFromRequest(userRequest, user);
        candidateMapper.updateEntityFromRequest(userRequest, candidate);

        userRepository.save(user);
        candidateRepository.save(candidate);
        return getCandidateProfileByUserEmail(email);
    }

    @Transactional
    public CandidateProfileResponse updateAddresInfoByEmail(String email, AddressRequest request){

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

        candidate.setAddress(address);
        addressRepository.save(address);
        candidateRepository.save(candidate);

        return getCandidateProfileByUserEmail(email);

    }



}
