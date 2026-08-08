package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.AddressRequest;
import com.gemstoneseekers.dtos.request.CandidateLanguageRequest;
import com.gemstoneseekers.dtos.request.CertificationRequest;
import com.gemstoneseekers.dtos.request.EducationRequest;
import com.gemstoneseekers.dtos.request.ExperienceRequest;
import com.gemstoneseekers.dtos.request.LinkItemRequest;
import com.gemstoneseekers.dtos.request.ProjectRequest;
import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.dtos.response.CandidateResponse;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.enums.UserRole;
import java.time.LocalDate;
import com.gemstoneseekers.services.AddressService;
import com.gemstoneseekers.services.CandidateLanguageService;
import com.gemstoneseekers.services.CandidateLinkService;
import com.gemstoneseekers.services.CertificationService;
import com.gemstoneseekers.services.EducationService;
import com.gemstoneseekers.services.ExperienceService;
import com.gemstoneseekers.services.ProjectService;
import com.gemstoneseekers.services.UserProfileService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserProfileControllerTest {

    private final AddressService addressService = mock(AddressService.class);
    private final UserProfileService userProfileService = mock(UserProfileService.class);
    private final CandidateLinkService candidateLinkService = mock(CandidateLinkService.class);
    private final ExperienceService experienceService = mock(ExperienceService.class);
    private final EducationService educationService = mock(EducationService.class);
    private final CertificationService certificationService = mock(CertificationService.class);
    private final CandidateLanguageService candidateLanguageService = mock(CandidateLanguageService.class);
    private final ProjectService projectService = mock(ProjectService.class);
    private final UserProfileController controller = new UserProfileController(userProfileService, addressService,
        candidateLinkService, experienceService, educationService, certificationService, candidateLanguageService,
        projectService);

    @Test
    void shouldReturnCandidateProfileForAuthenticatedUser() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.getCandidateProfile(userDetails);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Candidate profile retrieved successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldUpdateCandidatePersonalInfoAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        UserRequest request = new UserRequest("John Doe", "new-password", "CPF", "12345678900", "11999999999",
            "Summary");
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.updatePersonalInfoByEmail(email, request)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.updateCandidateProfile(userDetails,
            request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("User info updated successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(userProfileService).updatePersonalInfoByEmail(email, request);
    }

    @Test
    void shouldUpdateCandidateAddressAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        AddressRequest request = new AddressRequest("01000-000", "Main Street", "100", "Center", "Apt 12",
            new com.gemstoneseekers.dtos.request.LocationRequest("São Paulo", "SP", "Brazil"));
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.updateCandidateAddres(userDetails,
            request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Candidate address updated successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(addressService).updateAddresInfoByEmail(email, request);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldAddCandidateLinkAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        LinkItemRequest request = new LinkItemRequest("GitHub", "https://github.com/john");
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.addCandidateLink(userDetails,
            request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Link added successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(candidateLinkService).addLink(email, request);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldAddCandidateExperienceAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        ExperienceRequest request = new ExperienceRequest("Developer", "Company", LocalDate.of(2022, 1, 1),
            LocalDate.of(2023, 1, 1), false, "Worked on backend services");
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.addCandidateExperience(userDetails,
            request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Experience added successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(experienceService).addExperience(email, request);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldAddEducationAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        EducationRequest request = new EducationRequest("University", "Computer Science", "Bachelor",
            LocalDate.of(2018, 1, 1), LocalDate.of(2022, 1, 1));
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.addEducation(userDetails, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Education added successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(educationService).addEducation(email, request);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldAddCertificationAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        CertificationRequest request = new CertificationRequest("AWS", "Amazon", LocalDate.of(2024, 1, 1),
            LocalDate.of(2027, 1, 1), "https://example.com/cert");
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.addCertification(userDetails,
            request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Certification added successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(certificationService).addCertification(email, request);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldAddLanguageAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        CandidateLanguageRequest request = new CandidateLanguageRequest("English", "Fluent");
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.addLanguage(userDetails, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Language added successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(candidateLanguageService).addCandidateLanguage(email, request);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldAddProjectAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UserDetails userDetails = userDetails(email);
        ProjectRequest request = new ProjectRequest("Portfolio", "Personal site", "https://example.com",
            LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31));
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.addProjects(userDetails, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Project added successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(projectService).addCandidateProject(email, request);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldDeleteCandidateLinkAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UUID linkId = UUID.randomUUID();
        UserDetails userDetails = userDetails(email);
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.deleteCandidateLink(userDetails,
            linkId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Link deleted successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(candidateLinkService).deleteLink(email, linkId);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldDeleteCandidateExperienceAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UUID experienceId = UUID.randomUUID();
        UserDetails userDetails = userDetails(email);
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.deleteCandidateExperience(
            userDetails, experienceId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Experience deleted successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(experienceService).deleteExperience(email, experienceId);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldDeleteCandidateEducationAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UUID educationId = UUID.randomUUID();
        UserDetails userDetails = userDetails(email);
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.deleteCandidateEducation(
            userDetails, educationId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Education deleted successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(educationService).deleteEducation(email, educationId);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldDeleteCandidateCertificationAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UUID certificationId = UUID.randomUUID();
        UserDetails userDetails = userDetails(email);
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.deleteCandidateCertification(
            userDetails, certificationId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Certification deleted successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(certificationService).deleteCertification(email, certificationId);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldDeleteLanguageAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        Integer languageId = 7;
        UserDetails userDetails = userDetails(email);
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.deleteLanguage(userDetails,
            languageId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Language deleted successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(candidateLanguageService).deleteCandidateLanguage(email, languageId);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    @Test
    void shouldDeleteProjectAndReturnUpdatedProfile() {
        String email = "candidate@example.com";
        UUID projectId = UUID.randomUUID();
        UserDetails userDetails = userDetails(email);
        CandidateProfileResponse profile = candidateProfile();
        when(userProfileService.getCandidateProfileByUserEmail(email)).thenReturn(profile);

        ResponseEntity<BaseResponse<CandidateProfileResponse>> response = controller.deleteProject(userDetails,
            projectId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isTrue();
        assertThat(response.getBody().message()).isEqualTo("Project deleted successfully");
        assertThat(response.getBody().result()).isEqualTo(profile);
        verify(projectService).deleteCandidateProject(email, projectId);
        verify(userProfileService).getCandidateProfileByUserEmail(email);
    }

    private static UserDetails userDetails(String email) {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(email);
        return userDetails;
    }

    private static CandidateProfileResponse candidateProfile() {
        UserResponse user = new UserResponse(UUID.randomUUID(), "John Doe", "candidate@example.com", UserRole.CANDIDATE,
            "CPF", "12345678900");
        CandidateResponse candidate = new CandidateResponse(UUID.randomUUID(), user, "11999999999", "Summary",
            List.of(), List.of(), List.of(), List.of(), List.of(), List.of());
        AddressResponse address = new AddressResponse(UUID.randomUUID(), null, "01000-000", "Main Street", "100",
            "Center", "Apt 12");
        return new CandidateProfileResponse(candidate, address);
    }
}
