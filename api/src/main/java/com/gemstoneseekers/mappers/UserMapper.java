package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.CompleteRegistrationResponse;
import com.gemstoneseekers.dtos.response.RegisterResponse;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.models.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public RegisterResponse toRegisterResponse(User user) {
        return new RegisterResponse(user.getId(), user.getName(), user.getEmail());
    }
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getDocumentType(),
            user.getDocumentNumber()
        );
    }

    public CompleteRegistrationResponse toCompleteRegistrationResponse(User user) {
        return new CompleteRegistrationResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getDocumentType(), user.getDocumentNumber());
    }
}
