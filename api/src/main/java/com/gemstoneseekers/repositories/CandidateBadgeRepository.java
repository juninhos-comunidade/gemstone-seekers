package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.CandidateBadge;
import com.gemstoneseekers.models.CandidateBadgeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CandidateBadgeRepository extends JpaRepository<CandidateBadge, CandidateBadgeId> {

    boolean existsByCandidateIdAndBadgeId(UUID candidateId, Integer badgeId);

    @Query("SELECT cb FROM CandidateBadge cb JOIN FETCH cb.badge b JOIN FETCH b.technology WHERE cb.candidate.id = :candidateId")
    List<CandidateBadge> findAllByCandidateIdWithDetails(@Param("candidateId") UUID candidateId);
}
