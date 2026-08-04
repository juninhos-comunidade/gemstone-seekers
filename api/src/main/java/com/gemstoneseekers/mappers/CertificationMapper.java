package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.CertificationResponse;
import com.gemstoneseekers.models.Certification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CertificationMapper {

    public CertificationResponse toCertificationResponse(Certification certification) {
        return new CertificationResponse(
            certification.getId(),
            certification.getName(),
            certification.getIssuingOrganization(),
            certification.getIssueDate(),
            certification.getExpirationDate(),
            certification.getCredentialUrl()
        );

    }

    public List<CertificationResponse> toResponseList(List<Certification> certifications) {
        if (certifications == null) {
            return List.of();
        }
        return certifications.stream()
            .map(this::toCertificationResponse)
            .collect(Collectors.toList());
    }



}
