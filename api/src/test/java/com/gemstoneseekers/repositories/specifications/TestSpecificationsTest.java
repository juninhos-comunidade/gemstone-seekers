package com.gemstoneseekers.repositories.specifications;

import com.gemstoneseekers.dtos.request.TestHistoryFilterParams;
import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.Test;
import jakarta.persistence.criteria.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TestSpecificationsTest {

    @Mock
    private Root<Test> root;
    @Mock
    private CriteriaQuery<?> query;
    @Mock
    private CriteriaBuilder cb;
    @Mock
    private Path<Object> candidatePath;
    @Mock
    private Path<Object> candidateIdPath;
    @Mock
    private Path<Object> technologyPath;
    @Mock
    private Path<Object> technologyNamePath;
    @Mock
    private Path<TestStatus> statusPath;
    @Mock
    private Predicate candidatePredicate;
    @Mock
    private Predicate technologyPredicate;
    @Mock
    private Predicate statusPredicate;

    @BeforeEach
    void setUp() {
        when(root.get("candidate")).thenReturn(candidatePath);
        when(candidatePath.get("id")).thenReturn(candidateIdPath);

        when(root.get("technology")).thenReturn(technologyPath);
        when(technologyPath.get("name")).thenReturn(technologyNamePath);

        when(root.get( "status")).thenReturn(statusPath);

        when(cb.equal(any(), any())).thenReturn(mock(Predicate.class));
        when(cb.lower(any())).thenReturn(mock(Expression.class));
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should create only candidate predicate when filters are null")
    void shouldCreateOnlyCandidatePredicateWhenFiltersAreNull() {
        UUID candidateId = UUID.randomUUID();
        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);

        Specification<Test> spec = TestSpecifications.withFilters(candidateId, null);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, never()).equal(eq(technologyNamePath), anyString());
        verify(cb, never()).equal(eq(statusPath), any(TestStatus.class));
        verify(cb, times(1)).and(candidatePredicate);
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should create candidate and technology predicates when technology filter is provided")
    void shouldCreateCandidateAndTechnologyPredicates() {
        UUID candidateId = UUID.randomUUID();
        String technologyName = "java";
        TestHistoryFilterParams filters = new TestHistoryFilterParams(technologyName, null);

        Expression<String> lowerTechNamePath = mock(Expression.class);
        when(cb.lower(technologyNamePath)).thenReturn(lowerTechNamePath);
        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);
        when(cb.equal(lowerTechNamePath, technologyName.toLowerCase())).thenReturn(technologyPredicate);

        Specification<Test> spec = TestSpecifications.withFilters(candidateId, filters);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, times(1)).lower(technologyNamePath);
        verify(cb, times(1)).equal(lowerTechNamePath, technologyName.toLowerCase());
        verify(cb, never()).equal(eq(statusPath), any(TestStatus.class));
        verify(cb, times(1)).and(candidatePredicate, technologyPredicate);
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should not create technology predicate for blank technology name")
    void shouldNotCreateTechnologyPredicateForBlankTechnologyName() {
        UUID candidateId = UUID.randomUUID();
        TestHistoryFilterParams filters = new TestHistoryFilterParams(" ", null);
        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);

        Specification<Test> spec = TestSpecifications.withFilters(candidateId, filters);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, never()).lower(technologyNamePath);
        verify(cb, times(1)).and(candidatePredicate);
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should create candidate and status predicates when status filter is provided")
    void shouldCreateCandidateAndStatusPredicates() {
        UUID candidateId = UUID.randomUUID();
        TestStatus status = TestStatus.COMPLETED;
        TestHistoryFilterParams filters = new TestHistoryFilterParams(null, status);

        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);
        when(cb.equal(statusPath, status)).thenReturn(statusPredicate);

        Specification<Test> spec = TestSpecifications.withFilters(candidateId, filters);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, never()).lower(technologyNamePath);
        verify(cb, times(1)).equal(statusPath, status);
        verify(cb, times(1)).and(candidatePredicate, statusPredicate);
    }

    @org.junit.jupiter.api.Test
    @DisplayName("Should create all predicates when all filters are provided")
    void shouldCreateAllPredicatesWhenAllFiltersAreProvided() {
        UUID candidateId = UUID.randomUUID();
        String technologyName = "python";
        TestStatus status = TestStatus.IN_PROGRESS;
        TestHistoryFilterParams filters = new TestHistoryFilterParams(technologyName, status);

        Expression<String> lowerTechNamePath = mock(Expression.class);
        when(cb.lower(technologyNamePath)).thenReturn(lowerTechNamePath);
        when(cb.equal(candidateIdPath, candidateId)).thenReturn(candidatePredicate);
        when(cb.equal(lowerTechNamePath, technologyName.toLowerCase())).thenReturn(technologyPredicate);
        when(cb.equal(statusPath, status)).thenReturn(statusPredicate);

        Specification<Test> spec = TestSpecifications.withFilters(candidateId, filters);
        spec.toPredicate(root, query, cb);

        verify(cb, times(1)).equal(candidateIdPath, candidateId);
        verify(cb, times(1)).lower(technologyNamePath);
        verify(cb, times(1)).equal(lowerTechNamePath, technologyName.toLowerCase());
        verify(cb, times(1)).equal(statusPath, status);
        verify(cb, times(1)).and(candidatePredicate, technologyPredicate, statusPredicate);
    }
}
