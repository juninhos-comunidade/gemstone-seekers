package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.UserRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User", userId));

        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getDocumentType(),
            user.getDocumentNumber()
        );
    }
    public UserResponse updateUserByEmail(String email, UserRequest userRequest){
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email não pode ser nulo ou vazio");
        }
        if (userRequest == null) {
            throw new IllegalArgumentException("Requisição do usuário não pode ser nula");
        }
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User", email));
        userMapper.updateEntityFromRequest(userRequest, user);
        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }
}
