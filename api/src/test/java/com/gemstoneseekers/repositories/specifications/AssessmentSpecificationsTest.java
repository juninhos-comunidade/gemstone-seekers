package com.gemstoneseekers.repositories.specifications;

import com.gemstoneseekers.dtos.request.AssessmentHistoryFilterParams;
import com.gemstoneseekers.enums.AssessmentStatus;
import com.gemstoneseekers.models.Assessment;
import jakarta.persistence.criteria.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentSpecificationsTest {

    @Mock
    private Root<Assessment> root;
    @Mock
    private CriteriaQuery<?> query;
    @Mock
    private CriteriaBuilder cb;

    @Mock
    private Path<Object> candidatePath;
    @Mock
    private Path<UUID> candidateIdPath;

    @Mock
    private Path<Object> technologyPath;
    @Mock
    private Path<String> technologyNamePath;

    @Mock
    private Path<AssessmentStatus> statusPath;

    @Mock
    private Predicate candidatePredicate;
    @Mock
    private Predicate technologyPredicate;
    @Mock
    private Predicate statusPredicate;

    @BeforeEach
    void setUp() {
        // O Candidate sempre é utilizado, então permanece rigoroso
        doReturn(candidatePath).when(root).get("candidate");
        doReturn(candidateIdPath).when(candidatePath).get("id");

        // Technology e Status são filtros opcionais, então devem ser declarados como
        // lenient (permissivos)
        lenient().doReturn(technologyPath).when(root).get("technology");
        lenient().doReturn(technologyNamePath).when(technologyPath).get("name");
        lenient().doReturn(statusPath).when(root).get("status");

        lenient().when(cb.equal(any(), any())).thenReturn(mock(Predicate.class));
        lenient().when(cb.lower(any())).thenReturn(mock(Expression.class));
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should create only candidate predicate when filters are null")
    void shouldCreateOnlyCandidatePredicateWhenFiltersAreNull() {
        UUID candidateId = UUID.randomUUID();
        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);

        Specification<Assessment> spec = AssessmentSpecifications.withFilters(candidateId, null);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, never()).equal(eq(technologyNamePath), anyString());
        verify(cb, never()).equal(eq(statusPath), any(AssessmentStatus.class));
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should create candidate and technology predicates when technology filter is provided")
    void shouldCreateCandidateAndTechnologyPredicates() {
        UUID candidateId = UUID.randomUUID();
        String technologyName = "java";
        AssessmentHistoryFilterParams filters = new AssessmentHistoryFilterParams(technologyName, null);

        @SuppressWarnings("unchecked")
        Expression<String> lowerTechNamePath = mock(Expression.class);

        when(cb.lower(technologyNamePath)).thenReturn(lowerTechNamePath);
        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);
        when(cb.equal(lowerTechNamePath, technologyName.toLowerCase())).thenReturn(technologyPredicate);

        Specification<Assessment> spec = AssessmentSpecifications.withFilters(candidateId, filters);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, times(1)).lower(technologyNamePath);
        verify(cb, times(1)).equal(lowerTechNamePath, technologyName.toLowerCase());
        verify(cb, never()).equal(eq(statusPath), any(AssessmentStatus.class));
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should not create technology predicate for blank technology name")
    void shouldNotCreateTechnologyPredicateForBlankTechnologyName() {
        UUID candidateId = UUID.randomUUID();
        AssessmentHistoryFilterParams filters = new AssessmentHistoryFilterParams(" ", null);
        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);

        Specification<Assessment> spec = AssessmentSpecifications.withFilters(candidateId, filters);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, never()).lower(technologyNamePath);
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should create candidate and status predicates when status filter is provided")
    void shouldCreateCandidateAndStatusPredicates() {
        UUID candidateId = UUID.randomUUID();
        AssessmentStatus status = AssessmentStatus.COMPLETED;
        AssessmentHistoryFilterParams filters = new AssessmentHistoryFilterParams(null, status);

        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);
        when(cb.equal(statusPath, status)).thenReturn(statusPredicate);

        Specification<Assessment> spec = AssessmentSpecifications.withFilters(candidateId, filters);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, never()).lower(technologyNamePath);
        verify(cb, times(1)).equal(statusPath, status);
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should create all predicates when all filters are provided")
    void shouldCreateAllPredicatesWhenAllFiltersAreProvided() {
        UUID candidateId = UUID.randomUUID();
        String technologyName = "python";
        AssessmentStatus status = AssessmentStatus.IN_PROGRESS;
        AssessmentHistoryFilterParams filters = new AssessmentHistoryFilterParams(technologyName, status);

        @SuppressWarnings("unchecked")
        Expression<String> lowerTechNamePath = mock(Expression.class);

        when(cb.lower(technologyNamePath)).thenReturn(lowerTechNamePath);
        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);
        when(cb.equal(lowerTechNamePath, technologyName.toLowerCase())).thenReturn(technologyPredicate);
        when(cb.equal(statusPath, status)).thenReturn(statusPredicate);

        Specification<Assessment> spec = AssessmentSpecifications.withFilters(candidateId, filters);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, times(1)).lower(technologyNamePath);
        verify(cb, times(1)).equal(lowerTechNamePath, technologyName.toLowerCase());
        verify(cb, times(1)).equal(statusPath, status);
    }
}
