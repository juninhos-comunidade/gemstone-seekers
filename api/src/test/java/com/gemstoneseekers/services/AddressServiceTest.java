package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.AddressRequest;
import com.gemstoneseekers.dtos.request.LocationRequest;
import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.AddressMapper;
import com.gemstoneseekers.models.Address;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.City;
import com.gemstoneseekers.models.Country;
import com.gemstoneseekers.models.State;
import com.gemstoneseekers.repositories.AddressRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AddressServiceTest {

    @Mock
    private AddressMapper addressMapper;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private CountryService countryService;

    @Mock
    private StateService stateService;

    @Mock
    private CityService cityService;

    @InjectMocks
    private AddressService addressService;

    @Test
    void shouldReturnAddressById() {
        UUID id = UUID.randomUUID();
        Address address = new Address();
        address.setId(id);
        AddressResponse expected = new AddressResponse(id, null, "01000-000", "Main Street", "100", "Center", "Apt 12");
        when(addressRepository.findById(id)).thenReturn(Optional.of(address));
        when(addressMapper.toAddressResponse(address)).thenReturn(expected);

        AddressResponse result = addressService.getAddressById(id);

        assertThat(result).isEqualTo(expected);
        verify(addressRepository).findById(id);
        verify(addressMapper).toAddressResponse(address);
    }

    @Test
    void shouldThrowWhenAddressDoesNotExist() {
        UUID id = UUID.randomUUID();
        when(addressRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> addressService.getAddressById(id)).isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Address with id " + id + " not found");
        verify(addressMapper, never()).toAddressResponse(any());
    }

    @Test
    void shouldUpdateExistingAddressWithResolvedLocationData() {
        String email = "candidate@example.com";
        Candidate candidate = new Candidate();
        candidate.setId(UUID.randomUUID());
        Address address = new Address();
        address.setId(UUID.randomUUID());
        candidate.setAddress(address);
        Country country = new Country();
        country.setId(10);
        State state = new State();
        state.setId(20);
        state.setCountry(country);
        City city = new City();
        city.setId(30);
        city.setState(state);
        AddressRequest request = new AddressRequest("01000-000", "Main Street", "100", "Center", "Apt 12",
                new LocationRequest("São Paulo", "SP", "Brazil"));

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(countryService.getCountry("Brazil")).thenReturn(country);
        when(stateService.getCanonicalState("SP", country)).thenReturn(state);
        when(cityService.getOrCreateCity("São Paulo", state)).thenReturn(city);
        doAnswer(invocation -> {
            AddressRequest value = invocation.getArgument(0);
            Address target = invocation.getArgument(1);
            target.setZipCode(value.zipCode());
            target.setStreet(value.street());
            target.setNumber(value.number());
            target.setNeighborhood(value.neighborhood());
            target.setComplement(value.complement());
            return null;
        }).when(addressMapper).updateEntityFromRequest(request, address);

        addressService.updateAddressInfoByEmail(email, request);

        assertThat(address.getCity()).isEqualTo(city);
        assertThat(address.getZipCode()).isEqualTo("01000-000");
        assertThat(address.getStreet()).isEqualTo("Main Street");
        assertThat(candidate.getAddress()).isEqualTo(address);
        verify(countryService).getCountry("Brazil");
        verify(stateService).getCanonicalState("SP", country);
        verify(cityService).getOrCreateCity("São Paulo", state);
        verify(addressMapper).updateEntityFromRequest(request, address);
    }

    @Test
    void shouldCreateAddressWhenCandidateHasNoneAndSkipLocationResolutionWhenMissing() {
        String email = "candidate@example.com";
        Candidate candidate = new Candidate();
        candidate.setId(UUID.randomUUID());
        AddressRequest request = new AddressRequest("01000-000", "Main Street", "100", "Center", "Apt 12", null);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        doAnswer(invocation -> {
            AddressRequest value = invocation.getArgument(0);
            Address target = invocation.getArgument(1);
            target.setZipCode(value.zipCode());
            target.setStreet(value.street());
            target.setNumber(value.number());
            target.setNeighborhood(value.neighborhood());
            target.setComplement(value.complement());
            return null;
        }).when(addressMapper).updateEntityFromRequest(eq(request), any(Address.class));

        addressService.updateAddressInfoByEmail(email, request);

        ArgumentCaptor<Address> addressCaptor = ArgumentCaptor.forClass(Address.class);
        verify(addressMapper).updateEntityFromRequest(eq(request), addressCaptor.capture());
        Address capturedAddress = addressCaptor.getValue();

        assertThat(capturedAddress.getCity()).isNull();
        assertThat(capturedAddress.getZipCode()).isEqualTo("01000-000");
        assertThat(candidate.getAddress()).isSameAs(capturedAddress);
        verifyNoInteractions(countryService, stateService, cityService);
    }

    @Test
    void shouldThrowWhenCandidateDoesNotExistForAddressUpdate() {
        String email = "candidate@example.com";
        AddressRequest request = new AddressRequest("01000-000", "Main Street", "100", "Center", "Apt 12", null);
        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> addressService.updateAddressInfoByEmail(email, request)).isInstanceOf(
                EntityNotFoundException.class).hasMessage("Candidate with id " + email + " not found");
        verifyNoInteractions(addressMapper, addressRepository, countryService, stateService, cityService);
    }
}
