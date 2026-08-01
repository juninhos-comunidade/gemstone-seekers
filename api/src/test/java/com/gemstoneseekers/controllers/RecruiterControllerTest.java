package com.gemstoneseekers.controllers;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.gemstoneseekers.dtos.request.RecruiterRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.RecruiterResponse;
import com.gemstoneseekers.mappers.RecruiterMapper;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.services.RecruiterService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RecruiterControllerTest {

    private final RecruiterService recruiterService = mock(RecruiterService.class);
    private final RecruiterMapper recruiterMapper = mock(RecruiterMapper.class);
    private final RecruiterController recruiterController = new RecruiterController(recruiterService, recruiterMapper);

    @Test
    void shouldLinkRecruiterToCompanyAndReturnCreatedStatus() {
        UUID companyId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID recruiterId = UUID.randomUUID();
        RecruiterRequest request = new RecruiterRequest(userId, "Engineering");
        Company company = new Company();
        company.setId(companyId);
        User user = new User();
        user.setId(userId);
        Recruiter recruiter = new Recruiter();
        recruiter.setId(recruiterId);
        recruiter.setUser(user);
        recruiter.setCompany(company);
        recruiter.setDepartment("Engineering");
        RecruiterResponse response = new RecruiterResponse(recruiterId, userId, companyId, "Engineering");
        when(recruiterService.linkToCompany(companyId, request)).thenReturn(recruiter);
        when(recruiterMapper.toRecruiterResponse(recruiter)).thenReturn(response);

        ResponseEntity<BaseResponse<RecruiterResponse>> result = recruiterController.linkToCompany(companyId, request);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        BaseResponse<RecruiterResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.message()).isEqualTo("Recruiter linked to company successfully");
        assertThat(body.result().userId()).isEqualTo(userId);
        assertThat(body.result().companyId()).isEqualTo(companyId);
        assertThat(body.result().department()).isEqualTo("Engineering");
        verify(recruiterService).linkToCompany(companyId, request);
        verify(recruiterMapper).toRecruiterResponse(recruiter);
    }

    @Test
    void shouldFindRecruitersByCompanyIdAndReturnOkStatus() {
        UUID companyId = UUID.randomUUID();
        Recruiter recruiter1 = new Recruiter();
        recruiter1.setId(UUID.randomUUID());
        Recruiter recruiter2 = new Recruiter();
        recruiter2.setId(UUID.randomUUID());
        RecruiterResponse response1 = new RecruiterResponse(recruiter1.getId(), UUID.randomUUID(), companyId, "Engineering");
        RecruiterResponse response2 = new RecruiterResponse(recruiter2.getId(), UUID.randomUUID(), companyId, "Marketing");
        when(recruiterService.findByCompanyId(companyId)).thenReturn(List.of(recruiter1, recruiter2));
        when(recruiterMapper.toRecruiterResponse(recruiter1)).thenReturn(response1);
        when(recruiterMapper.toRecruiterResponse(recruiter2)).thenReturn(response2);

        ResponseEntity<BaseResponse<List<RecruiterResponse>>> result = recruiterController.findByCompanyId(companyId);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<List<RecruiterResponse>> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.result()).hasSize(2);
        assertThat(body.result().get(0).department()).isEqualTo("Engineering");
        assertThat(body.result().get(1).department()).isEqualTo("Marketing");
        verify(recruiterService).findByCompanyId(companyId);
    }

    @Test
    void shouldFindRecruiterByIdAndReturnOkStatus() {
        UUID id = UUID.randomUUID();
        Recruiter recruiter = new Recruiter();
        recruiter.setId(id);
        RecruiterResponse response = new RecruiterResponse(id, UUID.randomUUID(), UUID.randomUUID(), "Engineering");
        when(recruiterService.findById(id)).thenReturn(recruiter);
        when(recruiterMapper.toRecruiterResponse(recruiter)).thenReturn(response);

        ResponseEntity<BaseResponse<RecruiterResponse>> result = recruiterController.findById(id);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        BaseResponse<RecruiterResponse> body = result.getBody();
        assertThat(body).isNotNull();
        assertThat(body.success()).isTrue();
        assertThat(body.result().id()).isEqualTo(id);
        assertThat(body.result().department()).isEqualTo("Engineering");
        verify(recruiterService).findById(id);
    }
}
