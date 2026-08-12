package com.gemstoneseekers.dtos.response;

import java.util.UUID;

public record AddressResponse(UUID id, CityResponse city, String zipCode, String street, String number,
        String neighborhood, String complement) {
}
