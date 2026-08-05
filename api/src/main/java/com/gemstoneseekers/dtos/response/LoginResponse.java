package com.gemstoneseekers.dtos.response;

public record LoginResponse(String accessToken, String refreshToken, boolean registrationCompleted) {
}
