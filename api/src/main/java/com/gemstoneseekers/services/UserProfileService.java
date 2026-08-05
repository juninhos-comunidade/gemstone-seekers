package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.dtos.response.CandidateResponse;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.CandidateMapper;
import com.gemstoneseekers.mappers.CandidateProfileMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserProfileService {
    private final AddressService addressService;
    private final CandidateMapper candidateMapper;
    private final CandidateProfileMapper candidateProfileMapper;
    private final CandidateRepository candidateRepository;

    public UserProfileService(AddressService addressService, CandidateMapper candidateMapper, CandidateProfileMapper candidateProfileMapper, CandidateRepository candidateRepository) {
        this.addressService = addressService;
        this.candidateMapper = candidateMapper;
        this.candidateProfileMapper = candidateProfileMapper;
        this.candidateRepository = candidateRepository;
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


}
