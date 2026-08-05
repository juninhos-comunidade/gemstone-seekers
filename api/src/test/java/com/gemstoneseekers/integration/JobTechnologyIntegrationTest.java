package com.gemstoneseekers.integration;

import com.gemstoneseekers.GemstoneSeekersApplication;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@Testcontainers
class JobTechnologyIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4");

    private static ConfigurableApplicationContext context;
    private static int port;

    @BeforeAll
    static void setup() {
        context = new SpringApplicationBuilder(GemstoneSeekersApplication.class).run(
                "--spring.datasource.url=" + postgres.getJdbcUrl(),
                "--spring.datasource.username=" + postgres.getUsername(),
                "--spring.datasource.password=" + postgres.getPassword(), "--server.port=0",
                "--jwt.secret=e93afb5d9ffc2f656b9039f768011829be9a88b539671e8aab8d347949a4da67",
                "--jwt.access-token.expiration=86400000", "--jwt.refresh-token.expiration=604800000");
        Integer resolvedPort = context.getEnvironment().getProperty("local.server.port", Integer.class);
        if (resolvedPort == null) {
            throw new IllegalStateException("Could not resolve local server port");
        }
        port = resolvedPort;
    }

    @AfterAll
    static void teardown() {
        if (context != null) {
            context.close();
        }
    }

    @BeforeEach
    void setUp() throws SQLException {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
        DataSource ds = context.getBean(DataSource.class);
        try (Connection conn = ds.getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("TRUNCATE TABLE recruiters, candidates, companies, users CASCADE");
        }
    }

    private String getAccessToken() {
        String registerBody = """
                {
                    "name": "John Doe",
                    "email": "john@example.com",
                    "password": "plainPassword123"
                }""";
        given().contentType(ContentType.JSON).body(registerBody).when().post("/api/v1/auth/register").then()
                .statusCode(201);
        String loginBody = """
                {
                    "email": "john@example.com",
                    "password": "plainPassword123"
                }""";
        return given().contentType(ContentType.JSON).body(loginBody).when().post("/api/v1/auth/login").then()
                .statusCode(200).extract().path("result.accessToken");
    }

    private record SeedData(UUID jobId, int technologyId) {
    }

    private SeedData seedJobWithTechnology() throws SQLException {
        DataSource ds = context.getBean(DataSource.class);
        try (Connection conn = ds.getConnection(); Statement stmt = conn.createStatement()) {
            UUID userId;
            try (ResultSet rs = stmt.executeQuery("SELECT id FROM users WHERE email = 'john@example.com'")) {
                if (!rs.next()) {
                    throw new IllegalStateException("Registered user not found");
                }
                userId = UUID.fromString(rs.getString("id"));
            }

            int technologyId;
            try (ResultSet rs = stmt
                    .executeQuery("SELECT id FROM technologies WHERE deleted_at IS NULL ORDER BY id LIMIT 1")) {
                if (!rs.next()) {
                    throw new IllegalStateException("No technologies found in seed data");
                }
                technologyId = rs.getInt("id");
            }

            UUID companyId = UUID.randomUUID();
            stmt.execute(String.format(
                    "INSERT INTO companies (id, name, cnpj) VALUES ('%s', 'Test Company', '12345678000199')",
                    companyId));

            UUID recruiterId = UUID.randomUUID();
            stmt.execute(String.format("INSERT INTO recruiters (id, user_id, company_id, department) "
                    + "VALUES ('%s', '%s', '%s', 'Engineering')", recruiterId, userId, companyId));

            UUID jobId = UUID.randomUUID();
            stmt.execute(String.format(
                    "INSERT INTO jobs (id, recruiter_id, company_id, title, description, status) "
                            + "VALUES ('%s', '%s', '%s', 'Java Developer', 'Backend role', 'OPEN')",
                    jobId, recruiterId, companyId));

            stmt.execute(String.format(
                    "INSERT INTO job_technologies (job_id, technology_id, is_mandatory) " + "VALUES ('%s', %d, true)",
                    jobId, technologyId));

            return new SeedData(jobId, technologyId);
        }
    }

    @Test
    void shouldRemoveTechnologyFromJobAndReturnOk() throws SQLException {
        String accessToken = getAccessToken();
        SeedData seed = seedJobWithTechnology();

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + accessToken)
                .pathParam("jobId", seed.jobId()).pathParam("technologyId", seed.technologyId()).when()
                .delete("/api/v1/jobs/{jobId}/technologies/{technologyId}").then().statusCode(200)
                .body("success", equalTo(true)).body("message", equalTo("Technology unlinked from job successfully"))
                .body("result", equalTo(null));
    }

    @Test
    void shouldReturnNotFoundWhenRemovingNonexistentLink() throws SQLException {
        String accessToken = getAccessToken();

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + accessToken)
                .pathParam("jobId", UUID.randomUUID()).pathParam("technologyId", 999).when()
                .delete("/api/v1/jobs/{jobId}/technologies/{technologyId}").then().statusCode(404)
                .body("success", equalTo(false)).body("error.code", equalTo("NOT_FOUND"));
    }
}
