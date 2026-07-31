package com.gemstoneseekers.integration;

import com.gemstoneseekers.enums.UserRole;
import com.gemstoneseekers.models.Address;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.City;
import com.gemstoneseekers.models.Company;
import com.gemstoneseekers.models.Country;
import com.gemstoneseekers.models.Recruiter;
import com.gemstoneseekers.models.State;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.User;
import jakarta.persistence.EntityManager;
import org.flywaydb.core.Flyway;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
class DomainRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4");

    private static SessionFactory sessionFactory;

    @BeforeAll
    static void setup() {
        Flyway flyway = Flyway.configure()
            .dataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())
            .locations("classpath:db/migration").load();
        flyway.migrate();

        Configuration cfg = new Configuration();
        cfg.setProperty("hibernate.connection.url", postgres.getJdbcUrl());
        cfg.setProperty("hibernate.connection.username", postgres.getUsername());
        cfg.setProperty("hibernate.connection.password", postgres.getPassword());
        cfg.setProperty("hibernate.connection.driver_class", postgres.getDriverClassName());
        cfg.setProperty("hibernate.hbm2ddl.auto", "validate");
        cfg.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");

        cfg.addAnnotatedClass(User.class);
        cfg.addAnnotatedClass(Company.class);
        cfg.addAnnotatedClass(Candidate.class);
        cfg.addAnnotatedClass(Recruiter.class);
        cfg.addAnnotatedClass(Address.class);
        cfg.addAnnotatedClass(City.class);
        cfg.addAnnotatedClass(State.class);
        cfg.addAnnotatedClass(Country.class);
        cfg.addAnnotatedClass(Technology.class);

        sessionFactory = cfg.buildSessionFactory();
    }

    @AfterAll
    static void teardown() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }

    @BeforeEach
    void cleanUp() {
        try (EntityManager em = sessionFactory.createEntityManager()) {
            em.getTransaction().begin();
            em.createNativeQuery("DELETE FROM recruiters").executeUpdate();
            em.createNativeQuery("DELETE FROM candidates").executeUpdate();
            em.createNativeQuery("DELETE FROM companies").executeUpdate();
            em.createNativeQuery("DELETE FROM users").executeUpdate();
            em.getTransaction().commit();
        }
    }

    @Test
    void shouldSaveAndFindCompany() {
        try (EntityManager em = sessionFactory.createEntityManager()) {
            em.getTransaction().begin();

            Company company = new Company();
            company.setName("Tech Corp");
            company.setCnpj("12345678000190");
            em.persist(company);

            em.getTransaction().commit();
            em.clear();

            Company found = em.find(Company.class, company.getId());

            assertThat(found).isNotNull();
            assertThat(found.getName()).isEqualTo("Tech Corp");
            assertThat(found.getCnpj()).isEqualTo("12345678000190");
            assertThat(found.getCreatedAt()).isNotNull();
            assertThat(found.getUpdatedAt()).isNotNull();
        }
    }

    @Test
    void shouldSaveAndFindCandidateWithUser() {
        try (EntityManager em = sessionFactory.createEntityManager()) {
            em.getTransaction().begin();

            User user = new User();
            user.setName("Test User");
            user.setEmail("candidate@example.com");
            user.setPassword("$2a$10$encodedPassword");
            user.setRole(UserRole.CANDIDATE);
            user.setDocumentType("CPF");
            user.setDocumentNumber("12345678900");
            em.persist(user);

            Candidate candidate = new Candidate();
            candidate.setUser(user);
            candidate.setPhone("+5511999999999");
            candidate.setSummary("Experienced backend developer");
            em.persist(candidate);

            em.getTransaction().commit();
            em.clear();

            Candidate found = em.createQuery(
                "SELECT c FROM Candidate c JOIN FETCH c.user WHERE c.user.id = :userId",
                Candidate.class
            ).setParameter("userId", user.getId()).getSingleResult();

            assertThat(found).isNotNull();
            assertThat(found.getPhone()).isEqualTo("+5511999999999");
            assertThat(found.getSummary()).isEqualTo("Experienced backend developer");
            assertThat(found.getUser().getId()).isEqualTo(user.getId());
        }
    }

    @Test
    void shouldSaveAndFindRecruiterWithUserAndCompany() {
        try (EntityManager em = sessionFactory.createEntityManager()) {
            em.getTransaction().begin();

            User user = new User();
            user.setName("Test User");
            user.setEmail("recruiter@example.com");
            user.setPassword("$2a$10$encodedPassword");
            user.setRole(UserRole.RECRUITER);
            user.setDocumentType("CPF");
            user.setDocumentNumber("12345678900");
            em.persist(user);

            Company company = new Company();
            company.setName("Tech Corp");
            company.setCnpj("12345678000190");
            em.persist(company);

            Recruiter recruiter = new Recruiter();
            recruiter.setUser(user);
            recruiter.setCompany(company);
            recruiter.setDepartment("Engineering");
            em.persist(recruiter);

            em.getTransaction().commit();
            em.clear();

            Recruiter found = em.createQuery(
                "SELECT r FROM Recruiter r JOIN FETCH r.user JOIN FETCH r.company WHERE r.user.id = :userId",
                Recruiter.class
            ).setParameter("userId", user.getId()).getSingleResult();

            assertThat(found).isNotNull();
            assertThat(found.getDepartment()).isEqualTo("Engineering");
            assertThat(found.getCompany().getName()).isEqualTo("Tech Corp");
            assertThat(found.getUser().getId()).isEqualTo(user.getId());
        }
    }

    @Test
    void shouldSaveAndFindTechnology() {
        try (EntityManager em = sessionFactory.createEntityManager()) {
            em.getTransaction().begin();
            Technology technology = new Technology();
            technology.setName("Java");
            technology.setCategory("Programming Language");
            em.persist(technology);
            em.getTransaction().commit();
            em.clear();

            Technology found = em.find(Technology.class, technology.getId());
            assertThat(found).isNotNull();
            assertThat(found.getName()).isEqualTo("Java");
            assertThat(found.getCategory()).isEqualTo("Programming Language");
            assertThat(found.getCreatedAt()).isNotNull();
            assertThat(found.getUpdatedAt()).isNotNull();
        }
    }
}
