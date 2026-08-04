package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.CandidateLinkResponse;
import com.gemstoneseekers.models.CandidateLink;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CandidateLinkMapper {

    public CandidateLinkResponse toResponse(CandidateLink link) {
         return new CandidateLinkResponse(
            link.getId(),
            link.getName(),
            link.getUrl()
        );
    }

    public List<CandidateLinkResponse> toResponseList(List<CandidateLink> links) {
        if (links == null) {
            return List.of();
        }
        return links.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
}
