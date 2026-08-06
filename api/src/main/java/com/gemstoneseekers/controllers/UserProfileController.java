package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.AddressRequest;
import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.services.AddressService;
import com.gemstoneseekers.services.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {


    private final AddressService addressService;
    UserProfileService userProfileService;
    public UserProfileController(UserProfileService userProfileService, AddressService addressService) {
        this.userProfileService = userProfileService;
        this.addressService = addressService;
    }

    @GetMapping("")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> getCandidateProfile(
        @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        CandidateProfileResponse candidateProfile = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK)
            .body( new BaseResponse<>(true,"Candidate profile retrieved successfully", candidateProfile,null ));
    }

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

}
