package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.enums.UserRole;
import com.gemstoneseekers.exceptions.EntityNotFoundException;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldReturnUserResponseWhenGetUserByIdWithValidId() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setRole(UserRole.CANDIDATE);
        user.setDocumentType("CPF");
        user.setDocumentNumber("12345678900");

        UserResponse expectedResponse = new UserResponse(
            userId,
            "John Doe",
            "john@example.com",
            UserRole.CANDIDATE,
            "CPF",
            "12345678900"
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserResponse response = userService.getUserById(userId);

        assertThat(response).isEqualTo(expectedResponse);
        verify(userRepository).findById(userId);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenGetUserByIdWithInvalidId() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(userId))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("User with id " + userId + " not found");

        verify(userRepository).findById(userId);
    }

    @Test
    void shouldUpdateAndReturnUserResponseWhenUpdateUserByEmailWithValidData() {
        String email = "john@example.com";
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setName("John Doe");
        user.setEmail(email);
        user.setRole(UserRole.CANDIDATE);
        user.setDocumentType("CPF");
        user.setDocumentNumber("12345678900");

        UserRequest request = new UserRequest(
            "Jane Doe",
            "newPassword123",
            "RG",
            "12345678",
            null,
            null
        );

        User updatedUser = new User();
        updatedUser.setId(userId);
        updatedUser.setName("Jane Doe");
        updatedUser.setEmail(email);

        UserResponse expectedResponse = new UserResponse(
            userId,
            "Jane Doe",
            email,
            UserRole.CANDIDATE,
            "RG",
            "12345678"
        );

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(updatedUser);
        when(userMapper.toUserResponse(updatedUser)).thenReturn(expectedResponse);

        UserResponse response = userService.updateUserByEmail(email, request);

        assertThat(response).isEqualTo(expectedResponse);
        verify(userRepository).findByEmail(email);
        verify(userMapper).updateEntityFromRequest(request, user);
        verify(userRepository).save(user);
        verify(userMapper).toUserResponse(updatedUser);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenUpdateUserByEmailWithNonExistentEmail() {
        String email = "nonexistent@example.com";
        UserRequest request = new UserRequest(
            "Jane Doe",
            "newPassword123",
            null,
            null,
            null,
            null
        );

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUserByEmail(email, request))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("User with id " + email + " not found");

        verify(userRepository).findByEmail(email);
        verify(userMapper, never()).updateEntityFromRequest(any(), any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldThrowIllegalArgumentExceptionWhenUpdateUserByEmailWithNullEmail() {
        UserRequest request = new UserRequest(
            "Jane Doe",
            "newPassword123",
            null,
            null,
            null,
            null
        );

        assertThatThrownBy(() -> userService.updateUserByEmail(null, request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Email não pode ser nulo ou vazio");

        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    void shouldThrowIllegalArgumentExceptionWhenUpdateUserByEmailWithBlankEmail() {
        UserRequest request = new UserRequest(
            "Jane Doe",
            "newPassword123",
            null,
            null,
            null,
            null
        );

        assertThatThrownBy(() -> userService.updateUserByEmail("   ", request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Email não pode ser nulo ou vazio");

        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    void shouldThrowIllegalArgumentExceptionWhenUpdateUserByEmailWithNullRequest() {
        String email = "john@example.com";

        assertThatThrownBy(() -> userService.updateUserByEmail(email, null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Requisição do usuário não pode ser nula");

        verify(userRepository, never()).findByEmail(email);
    }

    @Test
    void shouldPropagateIllegalArgumentExceptionFromMapperWhenDocumentInconsistent() {
        String email = "john@example.com";
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setEmail(email);

        UserRequest request = new UserRequest(
            null,
            null,
            "CPF",
            null,
            null,
            null
        );

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        doThrow(new IllegalArgumentException(
            "Inconsistência: Ao alterar o tipo de documento, você deve fornecer o novo número correspondente."
        )).when(userMapper).updateEntityFromRequest(request, user);

        assertThatThrownBy(() -> userService.updateUserByEmail(email, request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Inconsistência: Ao alterar o tipo de documento, você deve fornecer o novo número correspondente.");

        verify(userRepository).findByEmail(email);
        verify(userMapper).updateEntityFromRequest(request, user);
        verify(userRepository, never()).save(any());
    }

}
