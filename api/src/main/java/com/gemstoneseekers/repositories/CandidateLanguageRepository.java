package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.CandidateLanguage;
import com.gemstoneseekers.models.CandidateLanguageId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateLanguageRepository extends JpaRepository<CandidateLanguage, CandidateLanguageId> {

}
