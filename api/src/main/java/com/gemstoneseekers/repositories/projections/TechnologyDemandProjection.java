package com.gemstoneseekers.repositories.projections;

public interface TechnologyDemandProjection {
    Integer getTechnologyId();

    String getTechnologyName();

    String getTechnologyCategory();

    Long getJobCount();

    Long getMandatoryCount();
}
