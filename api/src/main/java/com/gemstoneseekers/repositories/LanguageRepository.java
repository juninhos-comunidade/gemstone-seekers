package com.gemstoneseekers.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gemstoneseekers.models.Language;

import java.util.Optional;

public interface LanguageRepository extends JpaRepository<Language, Integer> {

    Optional<Language> findByNameIgnoreCase(String name);
}
