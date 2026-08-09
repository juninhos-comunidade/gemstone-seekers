package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.AddressResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.dtos.response.CandidateResponse;
import org.springframework.stereotype.Component;

@Component
public class CandidateProfileMapper {

    public CandidateProfileResponse toProfileResponse(CandidateResponse candidate, AddressResponse address) {
        if (candidate == null && address == null) {
            return null;
        }

        return new CandidateProfileResponse(candidate, address);
    }
}
