package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.RegisterRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.RegisterResponse;
import com.gemstoneseekers.mappers.UserMapper;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    public AuthController(
        AuthService authService,
        UserMapper userMapper) {
        this.authService = authService;
        this.userMapper = userMapper;
    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        User             user     = authService.register(request);
        RegisterResponse response = userMapper.toRegisterResponse(user);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new BaseResponse<>(true, "User registered successfully", response, null));
    }
}
