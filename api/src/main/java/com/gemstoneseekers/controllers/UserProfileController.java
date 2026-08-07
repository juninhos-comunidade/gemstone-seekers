package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.*;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.models.Education;
import com.gemstoneseekers.models.Experience;
import com.gemstoneseekers.services.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {


    private final AddressService addressService;
    private final UserProfileService userProfileService;
    private final CandidateLinkService candidateLinkService;
    private final ExperienceService experienceService;
    private final EducationService educationService;

    public UserProfileController(UserProfileService userProfileService, AddressService addressService, CandidateLinkService candidateLinkService, ExperienceService experienceService, EducationService educationService) {
        this.userProfileService = userProfileService;
        this.addressService = addressService;
        this.candidateLinkService = candidateLinkService;
        this.experienceService = experienceService;
        this.educationService = educationService;
    }
//=================GET======================================================
    @GetMapping("")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> getCandidateProfile(
        @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        CandidateProfileResponse candidateProfile = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK)
            .body( new BaseResponse<>(true,"Candidate profile retrieved successfully", candidateProfile,null ));
    }

//=================PATCH======================================================
    @PatchMapping("/user")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> updateCandidateProfile(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody UserRequest request)
    {
        String email = userDetails.getUsername();
        CandidateProfileResponse updatedUser = userProfileService.updatePersonalInfoByEmail(email,request);

        return ResponseEntity.status(HttpStatus.OK)
            .body( new BaseResponse<>(true,"User info updated successfully", updatedUser,null));
    }

    @PatchMapping("/address")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> updateCandidateAddres(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody AddressRequest request)
    {
        String email = userDetails.getUsername();

        addressService.updateAddresInfoByEmail(email,request);
        CandidateProfileResponse candidateProfile = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK)
            .body( new BaseResponse<>(true,"Candidate address updated successfully", candidateProfile,null));
    }

//=================POST======================================================
    @PostMapping("/links")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addCandidateLink(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody LinkItemRequest request) {

            String email = userDetails.getUsername();
            candidateLinkService.addLink(email, request);

            CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

            return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Link added successfully", updatedUser, null));

      }

    @PostMapping("/experiences")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addCandidateExperience(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody ExperienceRequest request) {

        String email = userDetails.getUsername();
        experienceService.addExperience(email, request);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "Experience added successfully", updatedUser, null));

    }

    @PostMapping("/educations")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addEducation(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody EducationRequest request) {

        String email = userDetails.getUsername();
        educationService.addEducation(email, request);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "Experience added successfully", updatedUser, null));

    }
// ===================DELETE===================================================================

    @DeleteMapping("/links/{linkId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteCandidateLink(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID linkId) {

            String email = userDetails.getUsername();
            candidateLinkService.deleteLink(email, linkId);
            CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

            return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(true, "Link deleted successfully", updatedUser, null));

      }

    @DeleteMapping("/experiences/{experienceId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteCandidateExperience(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID experienceId) {

        String email = userDetails.getUsername();
        experienceService.deleteExperience(email, experienceId);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "Experience deleted successfully", updatedUser, null));

    }

    @DeleteMapping("/educations/{educationId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteCandidateEducation(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID educationId) {

        String email = userDetails.getUsername();
        educationService.deleteEducation(email, educationId);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BaseResponse<>(true, "Education deleted successfully", updatedUser, null));

    }
}
