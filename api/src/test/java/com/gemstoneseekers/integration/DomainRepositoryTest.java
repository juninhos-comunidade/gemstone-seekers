package com.gemstoneseekers.integration;

import com.gemstoneseekers.enums.UserRole;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.CompanyRepository;
import com.gemstoneseekers.repositories.RecruiterRepository;
import com.gemstoneseekers.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Testcontainers
class DomainRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndFindCompany() {
        Company company = new Company();
        company.setName("Tech Corp");
        company.setCnpj("12345678000190");

        Company saved = companyRepository.save(company);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();

        Optional<Company> found = companyRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Tech Corp");
        assertThat(found.get().getCnpj()).isEqualTo("12345678000190");
    }

    @Test
    void shouldSaveAndFindCandidateWithUser() {
        User user = createUser("candidate@example.com", UserRole.CANDIDATE);

        Candidate candidate = new Candidate();
        candidate.setUser(user);
        candidate.setPhone("+5511999999999");
        candidate.setSummary("Experienced backend developer");

        Candidate saved = candidateRepository.save(candidate);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUser().getId()).isEqualTo(user.getId());

        Optional<Candidate> found = candidateRepository.findByUserId(user.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getPhone()).isEqualTo("+5511999999999");
        assertThat(found.get().getSummary()).isEqualTo("Experienced backend developer");
    }

    @Test
    void shouldSaveAndFindRecruiterWithUserAndCompany() {
        User user = createUser("recruiter@example.com", UserRole.RECRUITER);

        Company company = new Company();
        company.setName("Tech Corp");
        companyRepository.save(company);

        Recruiter recruiter = new Recruiter();
        recruiter.setUser(user);
        recruiter.setCompany(company);
        recruiter.setDepartment("Engineering");

        Recruiter saved = recruiterRepository.save(recruiter);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUser().getId()).isEqualTo(user.getId());
        assertThat(saved.getCompany().getId()).isEqualTo(company.getId());

        Optional<Recruiter> found = recruiterRepository.findByUserId(user.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getDepartment()).isEqualTo("Engineering");
        assertThat(found.get().getCompany().getName()).isEqualTo("Tech Corp");
    }

    private User createUser(
        String email,
        UserRole role) {
        User user = new User();
        user.setName("Test User");
        user.setEmail(email);
        user.setPassword("$2a$10$encodedPassword");
        user.setRole(role);
        user.setDocumentType("CPF");
        user.setDocumentNumber("12345678900");
        return userRepository.save(user);
    }
}
