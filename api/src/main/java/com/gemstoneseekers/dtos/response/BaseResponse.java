package com.gemstoneseekers.dtos.response;

public record BaseResponse<T>(boolean success, String message, T result, ErrorResponse error) {
}
