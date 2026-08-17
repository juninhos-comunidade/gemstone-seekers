package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.AddressRequest;
import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.request.LinkItemRequest;
import com.gemstoneseekers.dtos.request.ExperienceRequest;
import com.gemstoneseekers.dtos.request.EducationRequest;
import com.gemstoneseekers.dtos.request.CertificationRequest;
import com.gemstoneseekers.dtos.request.CandidateLanguageRequest;
import com.gemstoneseekers.dtos.request.ProjectRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.services.AddressService;
import com.gemstoneseekers.services.CandidateLinkService;
import com.gemstoneseekers.services.ExperienceService;
import com.gemstoneseekers.services.UserProfileService;
import com.gemstoneseekers.services.EducationService;
import com.gemstoneseekers.services.CertificationService;
import com.gemstoneseekers.services.CandidateLanguageService;
import com.gemstoneseekers.services.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {

    private final AddressService addressService;
    private final UserProfileService userProfileService;
    private final CandidateLinkService candidateLinkService;
    private final ExperienceService experienceService;
    private final EducationService educationService;
    private final CertificationService certificationService;
    private final CandidateLanguageService candidateLanguageService;
    private final ProjectService projectService;
    public static final String CANDIDATE_ROLE = "hasRole('CANDIDATE')";
    public UserProfileController(UserProfileService userProfileService, AddressService addressService,
            CandidateLinkService candidateLinkService, ExperienceService experienceService,
            EducationService educationService, CertificationService certificationService,
            CandidateLanguageService candidateLanguageService, ProjectService projectService) {
        this.userProfileService = userProfileService;
        this.addressService = addressService;
        this.candidateLinkService = candidateLinkService;
        this.experienceService = experienceService;
        this.educationService = educationService;
        this.certificationService = certificationService;
        this.candidateLanguageService = candidateLanguageService;
        this.projectService = projectService;
    }
    @GetMapping("")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> getCandidateProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        CandidateProfileResponse candidateProfile = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true,
                "Candidate profile retrieved successfully", candidateProfile, null));
    }

    @PatchMapping("/user")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> updateCandidateProfile(
            @AuthenticationPrincipal UserDetails userDetails, @RequestBody UserRequest request) {
        String email = userDetails.getUsername();
        CandidateProfileResponse updatedUser = userProfileService.updatePersonalInfoByEmail(email, request);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "User info updated successfully",
                updatedUser, null));
    }

    @PatchMapping("/address")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> updateCandidateAddres(
            @AuthenticationPrincipal UserDetails userDetails, @RequestBody AddressRequest request) {
        String email = userDetails.getUsername();

        addressService.updateAddressInfoByEmail(email, request);
        CandidateProfileResponse candidateProfile = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true,
                "Candidate address updated successfully", candidateProfile, null));
    }

    @PostMapping("/links")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addCandidateLink(
            @AuthenticationPrincipal UserDetails userDetails, @RequestBody LinkItemRequest request) {

        String email = userDetails.getUsername();
        candidateLinkService.addLink(email, request);

        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Link added successfully",
                updatedUser, null));

    }

    @PostMapping("/experiences")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addCandidateExperience(
            @AuthenticationPrincipal UserDetails userDetails, @RequestBody ExperienceRequest request) {

        String email = userDetails.getUsername();
        experienceService.addExperience(email, request);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Experience added successfully",
                updatedUser, null));

    }

    @PostMapping("/educations")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addEducation(
            @AuthenticationPrincipal UserDetails userDetails, @RequestBody EducationRequest request) {

        String email = userDetails.getUsername();
        educationService.addEducation(email, request);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Education added successfully",
                updatedUser, null));

    }
    @PostMapping("/certifications")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addCertification(
            @AuthenticationPrincipal UserDetails userDetails, @RequestBody CertificationRequest request) {

        String email = userDetails.getUsername();
        certificationService.addCertification(email, request);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Certification added successfully",
                updatedUser, null));
    }

    @PostMapping("/languages")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addLanguage(
            @AuthenticationPrincipal UserDetails userDetails, @RequestBody CandidateLanguageRequest request) {

        String email = userDetails.getUsername();

        candidateLanguageService.addCandidateLanguage(email, request);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Language added successfully",
                updatedUser, null));
    }
    @PostMapping("/projects")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> addProjects(
            @AuthenticationPrincipal UserDetails userDetails, @RequestBody ProjectRequest request) {

        String email = userDetails.getUsername();

        projectService.addCandidateProject(email, request);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Project added successfully",
                updatedUser, null));
    }

    @DeleteMapping("/links/{linkId}")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteCandidateLink(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable UUID linkId) {

        String email = userDetails.getUsername();
        candidateLinkService.deleteLink(email, linkId);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Link deleted successfully",
                updatedUser, null));

    }

    @DeleteMapping("/experiences/{experienceId}")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteCandidateExperience(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable UUID experienceId) {

        String email = userDetails.getUsername();
        experienceService.deleteExperience(email, experienceId);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Experience deleted successfully",
                updatedUser, null));

    }

    @DeleteMapping("/educations/{educationId}")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteCandidateEducation(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable UUID educationId) {

        String email = userDetails.getUsername();
        educationService.deleteEducation(email, educationId);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Education deleted successfully",
                updatedUser, null));

    }
    @DeleteMapping("/certifications/{certificationId}")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteCandidateCertification(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable UUID certificationId) {

        String email = userDetails.getUsername();
        certificationService.deleteCertification(email, certificationId);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Certification deleted successfully",
                updatedUser, null));

    }
    @DeleteMapping("/languages/{languageId}")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteLanguage(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Integer languageId) {

        String email = userDetails.getUsername();
        candidateLanguageService.deleteCandidateLanguage(email, languageId);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Language deleted successfully",
                updatedUser, null));

    }
    @DeleteMapping("/projects/{projectId}")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> deleteProject(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable UUID projectId) {

        String email = userDetails.getUsername();
        projectService.deleteCandidateProject(email, projectId);
        CandidateProfileResponse updatedUser = userProfileService.getCandidateProfileByUserEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(true, "Project deleted successfully",
                updatedUser, null));

    }
}
