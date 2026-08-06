package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.request.LinkItemRequest;
import com.gemstoneseekers.dtos.response.CandidateLinkResponse;
import com.gemstoneseekers.models.Candidate;
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

    public CandidateLink toCandidateLink(LinkItemRequest request, Candidate candidate) {
        CandidateLink newLink = new CandidateLink();
        if (request == null || candidate == null) {
            return null;
        }

        newLink.setCandidate(candidate);
        newLink.setName(request.name());
        newLink.setUrl(request.url());

        return  newLink;
   }
}
