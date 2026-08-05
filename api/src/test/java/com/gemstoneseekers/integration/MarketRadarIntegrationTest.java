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
import java.sql.SQLException;
import java.sql.Statement;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;

@Testcontainers
class MarketRadarIntegrationTest {

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
            stmt.execute("TRUNCATE TABLE job_technologies, jobs, recruiters, candidates, "
                    + "companies, users, technologies CASCADE");
        }
    }

    private String getAccessToken() {
        String registerBody = """
                {
                    "name": "Radar User",
                    "email": "radar@example.com",
                    "password": "plainPassword123"
                }""";
        given().contentType(ContentType.JSON).body(registerBody).when().post("/api/v1/auth/register").then()
                .statusCode(201);
        String loginBody = """
                {
                    "email": "radar@example.com",
                    "password": "plainPassword123"
                }""";
        return given().contentType(ContentType.JSON).body(loginBody).when().post("/api/v1/auth/login").then()
                .statusCode(200).extract().path("result.accessToken");
    }

    private void seedMarketRadarData() throws SQLException {
        DataSource ds = context.getBean(DataSource.class);
        try (Connection conn = ds.getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("INSERT INTO technologies (id, name, category) VALUES (1001, 'Java', 'Backend')");
            stmt.execute("INSERT INTO technologies (id, name, category) VALUES (1002, 'Python', 'Backend')");
            stmt.execute("INSERT INTO technologies (id, name, category) VALUES (1003, 'Go', 'Backend')");
            stmt.execute("INSERT INTO companies (id, name, cnpj) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000001', 'Tech Corp', '12345678000190')");
            stmt.execute("INSERT INTO users (id, name, email, password, role) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000002', 'Recruiter', "
                    + "'recruiter@test.com', 'hashed', 'RECRUITER')");
            stmt.execute("INSERT INTO recruiters (id, user_id, company_id) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000003', " + "'aaaaaaaa-0000-7000-8000-000000000002', "
                    + "'aaaaaaaa-0000-7000-8000-000000000001')");
            stmt.execute("INSERT INTO jobs (id, recruiter_id, company_id, title, description, status) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000010', " + "'aaaaaaaa-0000-7000-8000-000000000003', "
                    + "'aaaaaaaa-0000-7000-8000-000000000001', 'Java Dev', 'Backend role', 'OPEN')");
            stmt.execute("INSERT INTO jobs (id, recruiter_id, company_id, title, description, status) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000011', " + "'aaaaaaaa-0000-7000-8000-000000000003', "
                    + "'aaaaaaaa-0000-7000-8000-000000000001', 'Full Stack Dev', 'Full stack role', 'OPEN')");
            stmt.execute("INSERT INTO jobs (id, recruiter_id, company_id, title, description, status) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000012', " + "'aaaaaaaa-0000-7000-8000-000000000003', "
                    + "'aaaaaaaa-0000-7000-8000-000000000001', 'Go Dev', 'Go role', 'CLOSED')");
            stmt.execute("INSERT INTO job_technologies (job_id, technology_id, is_mandatory) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000010', 1001, true)");
            stmt.execute("INSERT INTO job_technologies (job_id, technology_id, is_mandatory) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000011', 1001, false)");
            stmt.execute("INSERT INTO job_technologies (job_id, technology_id, is_mandatory) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000010', 1002, true)");
            stmt.execute("INSERT INTO job_technologies (job_id, technology_id, is_mandatory) "
                    + "VALUES ('aaaaaaaa-0000-7000-8000-000000000012', 1003, true)");
        }
    }

    @Test
    void shouldRejectWithoutJwt() {
        given().contentType(ContentType.JSON).when().get("/api/v1/market-radar/technology-demand").then()
                .statusCode(401).body("success", equalTo(false)).body("error.code", equalTo("UNAUTHENTICATED"));
    }

    @Test
    void shouldReturnEmptyListWhenNoJobsExist() {
        String token = getAccessToken();
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).when()
                .get("/api/v1/market-radar/technology-demand").then().statusCode(200).body("success", equalTo(true))
                .body("result", hasSize(0));
    }

    @Test
    void shouldReturnTechnologyDemandForOpenJobsOnly() throws SQLException {
        String token = getAccessToken();
        seedMarketRadarData();
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).when()
                .get("/api/v1/market-radar/technology-demand").then().statusCode(200).body("success", equalTo(true))
                .body("result", hasSize(2)).body("result[0].technologyName", equalTo("Java"))
                .body("result[0].jobCount", equalTo(2)).body("result[0].mandatoryCount", equalTo(1))
                .body("result[1].technologyName", equalTo("Python")).body("result[1].jobCount", equalTo(1))
                .body("result[1].mandatoryCount", equalTo(1));
    }
}
