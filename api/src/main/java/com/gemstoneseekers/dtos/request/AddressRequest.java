package com.gemstoneseekers.dtos.request;

public record AddressRequest(String zipCode, String street, String number, String neighborhood, String complement,
        LocationRequest location) {
}
