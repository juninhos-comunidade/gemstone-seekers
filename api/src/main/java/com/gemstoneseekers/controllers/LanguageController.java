package com.gemstoneseekers.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.LanguageResponse;
import com.gemstoneseekers.services.LanguageService;

@RestController
@RequestMapping("/api/v1/languages")
public class LanguageController {

    private final LanguageService languageService;

    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<LanguageResponse>>> getLanguages() {
        List<LanguageResponse> languages = languageService.getLanguages();
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Languages retrieved successfully", languages, null));
    }
}
