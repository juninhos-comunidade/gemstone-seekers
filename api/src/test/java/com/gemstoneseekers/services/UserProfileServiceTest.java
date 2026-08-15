package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.dtos.response.CandidateResponse;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.enums.UserRole;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.CandidateMapper;
import com.gemstoneseekers.mappers.CandidateProfileMapper;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.Address;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private AddressService addressService;

    @Mock
    private CandidateMapper candidateMapper;

    @Mock
    private CandidateProfileMapper candidateProfileMapper;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private CandidateService candidateService;

    @Spy
    @InjectMocks
    private UserProfileService userProfileService;

    @Test
    void shouldReturnCandidateProfileWithAddressWhenCandidateHasAddress() {
        String email = "candidate@example.com";
        Candidate candidate = new Candidate();
        candidate.setId(UUID.randomUUID());
        Address address = new Address();
        address.setId(UUID.randomUUID());
        candidate.setAddress(address);
        CandidateResponse candidateResponse = candidateResponse();
        AddressResponse addressResponse = addressResponse();
        CandidateProfileResponse expected = new CandidateProfileResponse(candidateResponse, addressResponse);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(addressService.getAddressById(address.getId())).thenReturn(addressResponse);
        when(candidateMapper.toCandidateResponse(candidate)).thenReturn(candidateResponse);
        when(candidateProfileMapper.toProfileResponse(candidateResponse, addressResponse)).thenReturn(expected);

        CandidateProfileResponse result = userProfileService.getCandidateProfileByUserEmail(email);

        assertThat(result).isEqualTo(expected);
        verify(addressService).getAddressById(address.getId());
        verify(candidateMapper).toCandidateResponse(candidate);
        verify(candidateProfileMapper).toProfileResponse(candidateResponse, addressResponse);
    }

    @Test
    void shouldReturnCandidateProfileWithoutAddressWhenCandidateHasNoAddress() {
        String email = "candidate@example.com";
        Candidate candidate = new Candidate();
        candidate.setId(UUID.randomUUID());
        CandidateResponse candidateResponse = candidateResponse();
        CandidateProfileResponse expected = new CandidateProfileResponse(candidateResponse, null);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(candidateMapper.toCandidateResponse(candidate)).thenReturn(candidateResponse);
        when(candidateProfileMapper.toProfileResponse(candidateResponse, null)).thenReturn(expected);

        CandidateProfileResponse result = userProfileService.getCandidateProfileByUserEmail(email);

        assertThat(result).isEqualTo(expected);
        verify(candidateMapper).toCandidateResponse(candidate);
        verify(candidateProfileMapper).toProfileResponse(candidateResponse, null);
        verifyNoInteractions(addressService);
    }

    @Test
    void shouldThrowWhenCandidateIsMissingForProfileLookup() {
        String email = "candidate@example.com";
        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userProfileService.getCandidateProfileByUserEmail(email)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Candidate for User with id " + email + " not found");
        verifyNoInteractions(addressService, candidateMapper, candidateProfileMapper);
    }

    @Test
    void shouldUpdatePersonalInfoAndReturnRefreshedProfile() {
        String email = "candidate@example.com";
        UserRequest request = new UserRequest("John Doe", "new-password", "CPF", "12345678900", "11999999999",
                "Updated summary");
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setName("Old Name");
        Candidate candidate = new Candidate();
        candidate.setId(UUID.randomUUID());
        candidate.setUser(user);
        candidate.setPhone("11988888888");
        candidate.setSummary("Old summary");
        CandidateProfileResponse expectedProfile = new CandidateProfileResponse(candidateResponse(), null);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(candidateService.getCandidateByUserId(user.getId())).thenReturn(candidate);
        doAnswer(invocation -> {
            UserRequest value = invocation.getArgument(0);
            User target = invocation.getArgument(1);
            target.setName(value.name());
            return null;
        }).when(userMapper).updateEntityFromRequest(request, user);
        doAnswer(invocation -> {
            UserRequest value = invocation.getArgument(0);
            Candidate target = invocation.getArgument(1);
            target.setPhone(value.phone());
            target.setSummary(value.summary());
            return null;
        }).when(candidateMapper).updateEntityFromRequest(request, candidate);
        when(userRepository.save(user)).thenReturn(user);
        when(candidateRepository.save(candidate)).thenReturn(candidate);
        doReturn(expectedProfile).when(userProfileService).getCandidateProfileByUserEmail(email);

        CandidateProfileResponse result = userProfileService.updatePersonalInfoByEmail(email, request);

        assertThat(result).isEqualTo(expectedProfile);
        assertThat(user.getName()).isEqualTo("John Doe");
        assertThat(candidate.getPhone()).isEqualTo("11999999999");
        assertThat(candidate.getSummary()).isEqualTo("Updated summary");
        verify(userRepository).save(user);
        verify(candidateRepository).save(candidate);
        verify(userMapper).updateEntityFromRequest(request, user);
        verify(candidateMapper).updateEntityFromRequest(request, candidate);
    }

    @Test
    void shouldThrowWhenUserIsMissingForPersonalInfoUpdate() {
        String email = "candidate@example.com";
        UserRequest request = new UserRequest("John Doe", "new-password", "CPF", "12345678900", "11999999999",
                "Updated summary");
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userProfileService.updatePersonalInfoByEmail(email, request)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("User with id " + email + " not found");
        verify(userRepository, never()).save(any());
        verifyNoInteractions(candidateService, userMapper, candidateMapper, candidateRepository);
    }

    private static CandidateResponse candidateResponse() {
        UserResponse userResponse = new UserResponse(UUID.randomUUID(), "John Doe", "candidate@example.com",
                UserRole.CANDIDATE, "CPF", "12345678900");
        return new CandidateResponse(UUID.randomUUID(), userResponse, "11999999999", "Summary", null, null, null, null,
                null, null);
    }

    private static AddressResponse addressResponse() {
        return new AddressResponse(UUID.randomUUID(), null, "01000-000", "Main Street", "100", "Center", "Apt 12");
    }
}
