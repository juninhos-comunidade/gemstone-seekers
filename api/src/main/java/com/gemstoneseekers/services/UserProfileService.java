package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.dtos.response.CandidateResponse;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.CandidateMapper;
import com.gemstoneseekers.mappers.CandidateProfileMapper;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.User;
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
    private final CandidateService candidateService;

    public UserProfileService(AddressService addressService, CandidateMapper candidateMapper,
            CandidateProfileMapper candidateProfileMapper, CandidateRepository candidateRepository,
            UserRepository userRepository, UserMapper userMapper, CandidateService candidateService) {
        this.addressService = addressService;
        this.candidateMapper = candidateMapper;
        this.candidateProfileMapper = candidateProfileMapper;
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.candidateService = candidateService;
    }

    @Transactional()
    public CandidateProfileResponse getCandidateProfileByUserEmail(String email) {

        Candidate candidateEntity = candidateRepository.findByUserEmail(email).orElseThrow(
                () -> new EntityNotFoundException("Candidate for User", email));

        AddressResponse address = null;
        if (candidateEntity.getAddress() != null) {
            address = addressService.getAddressById(candidateEntity.getAddress().getId());
        }

        CandidateResponse candidate = candidateMapper.toCandidateResponse(candidateEntity);

        return candidateProfileMapper.toProfileResponse(candidate, address);
    }

    @Transactional
    public CandidateProfileResponse updatePersonalInfoByEmail(String email, UserRequest userRequest) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User", email));
        Candidate candidate = candidateService.getCandidateByUserId(user.getId());

        userMapper.updateEntityFromRequest(userRequest, user);
        candidateMapper.updateEntityFromRequest(userRequest, candidate);

        userRepository.save(user);
        candidateRepository.save(candidate);
        return getCandidateProfileByUserEmail(email);
    }

}
