package com.gemstoneseekers.dtos.request;


public record UserRequest(
    String name,
    String password,
    String documentType,
    String documentNumber,
    String phone,
    String summary
) {}
