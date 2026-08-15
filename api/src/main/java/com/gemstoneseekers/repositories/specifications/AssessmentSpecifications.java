package com.gemstoneseekers.repositories.specifications;

import com.gemstoneseekers.dtos.request.AssessmentHistoryFilterParams;
import com.gemstoneseekers.models.Assessment;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
public class AssessmentSpecifications {

    public static Specification<Assessment> withFilters(UUID candidateId, AssessmentHistoryFilterParams filters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("candidate").get("id"), candidateId));

            if (filters != null && filters.technology() != null && !filters.technology().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("technology").get("name")), filters.technology().toLowerCase(
                        Locale.ROOT)));
            }

            if (filters != null && filters.status() != null) {
                predicates.add(cb.equal(root.get("status"), filters.status()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
