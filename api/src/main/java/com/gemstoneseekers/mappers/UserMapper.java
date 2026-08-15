package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.CompleteRegistrationResponse;
import com.gemstoneseekers.dtos.response.RegisterResponse;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.models.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse toRegisterResponse(User user) {
        return new RegisterResponse(user.getId(), user.getName(), user.getEmail());
    }
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getDocumentType(),
                user.getDocumentNumber());
    }

    public CompleteRegistrationResponse toCompleteRegistrationResponse(User user) {
        return new CompleteRegistrationResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getDocumentType(), user.getDocumentNumber());
    }

    public void updateEntityFromRequest(UserRequest request, User user) {
        if (user == null || request == null) {
            return;
        }

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }

        if (request.documentType() != null && !request.documentType().isBlank()) {
            user.setDocumentType(request.documentType());
            if (request.documentNumber() == null || request.documentNumber().isBlank()) {
                throw new IllegalArgumentException(
                        "Inconsistência: Ao alterar o tipo de documento, você deve fornecer o novo número correspondente.");
            }
            user.setDocumentNumber(request.documentNumber());
        } else if (request.documentNumber() != null && !request.documentNumber().isBlank()) {
            user.setDocumentNumber(request.documentNumber());
        }
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
    }
}
