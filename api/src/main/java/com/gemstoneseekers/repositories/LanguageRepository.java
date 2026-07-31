package com.gemstoneseekers.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Language;

public interface LanguageRepository extends JpaRepository<Language, Integer> {
}
