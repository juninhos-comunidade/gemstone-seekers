package com.gemstoneseekers.mappers;

import org.springframework.stereotype.Component;

import com.gemstoneseekers.dtos.response.CompleteRegistrationResponse;
import com.gemstoneseekers.dtos.response.RegisterResponse;
import com.gemstoneseekers.models.User;

@Component
public class UserMapper {

    public RegisterResponse toRegisterResponse(User user) {
        return new RegisterResponse(
            user.getId(),
            user.getName(),
            user.getEmail());
    }

    public CompleteRegistrationResponse toCompleteRegistrationResponse(User user) {
        return new CompleteRegistrationResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getDocumentType(),
            user.getDocumentNumber());
    }
}
