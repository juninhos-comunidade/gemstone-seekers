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
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.notNullValue;

@Testcontainers
class StateIntegrationTest {
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

    @Test
    void shouldRejectStatesWithoutJwt() {
        given().contentType(ContentType.JSON).when().get("/api/v1/states").then().statusCode(401);
    }

    @Test
    void shouldReturnStatesWithJwt() {
        String accessToken = getAccessToken();
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + accessToken).when()
                .get("/api/v1/states").then().statusCode(200).body("success", equalTo(true))
                .body("result", notNullValue()).body("result.size()", greaterThan(0));
    }

    @Test
    void shouldReturnStatesByCountryId() {
        String accessToken = getAccessToken();
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + accessToken).when()
                .get("/api/v1/countries/1/states").then().statusCode(200).body("success", equalTo(true))
                .body("result", notNullValue()).body("result.size()", greaterThan(0));
    }
}
