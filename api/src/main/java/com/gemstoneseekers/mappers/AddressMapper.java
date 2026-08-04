package com.gemstoneseekers.mappers;

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
}
