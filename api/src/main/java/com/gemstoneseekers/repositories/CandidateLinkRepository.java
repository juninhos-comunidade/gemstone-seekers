package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.CandidateLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface CandidateLinkRepository extends JpaRepository<CandidateLink, UUID> {

}
