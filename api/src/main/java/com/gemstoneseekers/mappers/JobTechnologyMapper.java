package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.JobTechnologyResponse;
import com.gemstoneseekers.models.JobTechnology;
import org.springframework.stereotype.Component;

@Component
public class JobTechnologyMapper {

    public JobTechnologyResponse toJobTechnologyResponse(JobTechnology jobTechnology) {
        return new JobTechnologyResponse(jobTechnology.getTechnology().getId(), jobTechnology.getTechnology().getName(),
                jobTechnology.getTechnology().getCategory(), jobTechnology.getIsMandatory());
    }
}
