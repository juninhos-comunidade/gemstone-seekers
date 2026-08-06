package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.request.AddressRequest;
import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.models.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    CityMapper cityMapper;
    public AddressMapper(CityMapper cityMapper) {
        this.cityMapper = cityMapper;
    }

    public AddressResponse toAddressResponse(Address address) {
        return new AddressResponse(
            address.getId(),
            cityMapper.toCityResponse(address.getCity()),
            address.getZipCode(),
            address.getStreet(),
            address.getNumber(),
            address.getNeighborhood(),
            address.getComplement()
        );
    }

    public void updateEntityFromRequest(AddressRequest request, Address address) {
        if (request == null || address == null) {
            return;
        }

        if (request.zipCode() != null && !request.zipCode().isBlank()) {
            address.setZipCode(request.zipCode());
        }
        if (request.street() != null && !request.street().isBlank()) {
            address.setStreet(request.street());
        }
        if (request.number() != null && !request.number().isBlank()) {
            address.setNumber(request.number());
        }
        if (request.neighborhood() != null && !request.neighborhood().isBlank()) {
            address.setNeighborhood(request.neighborhood());
        }
        if (request.complement() != null) {
            address.setComplement(request.complement());
        }

    }
}
