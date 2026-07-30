package com.gemstoneseekers.integration;

import com.gemstoneseekers.GemstoneSeekersApplication;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

@Testcontainers
class AuthIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4");

    private static ConfigurableApplicationContext context;
    private static int port;

    @BeforeAll
    static void setup() {
        SpringApplication app = new SpringApplication(GemstoneSeekersApplication.class);
        app.setDefaultProperties(Map.of(
            "spring.datasource.url", postgres.getJdbcUrl(),
            "spring.datasource.username", postgres.getUsername(),
            "spring.datasource.password", postgres.getPassword(),
            "server.port", "0"
        ));
        context = app.run();
        port = context.getEnvironment().getProperty("local.server.port", Integer.class);
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
        try (
            Connection conn = ds.getConnection();
            Statement stmt = conn.createStatement()
        ) {
            stmt.execute("TRUNCATE TABLE recruiters, candidates, companies, users CASCADE");
        }
    }

    @Test
    void shouldCompleteFullAuthFlow() {
        String registerBody = """
                              {
                                  "name": "John Doe",
                                  "email": "john@example.com",
                                  "password": "plainPassword123"
                              }""";

        given()
            .contentType(ContentType.JSON)
            .body(registerBody)
            .when()
            .post("/api/v1/auth/register")
            .then()
            .statusCode(201)
            .body("success", equalTo(true))
            .body("result.email", equalTo("john@example.com"));

        String loginBody = """
                           {
                               "email": "john@example.com",
                               "password": "plainPassword123"
                           }""";

        String accessToken = given()
            .contentType(ContentType.JSON)
            .body(loginBody)
            .when()
            .post("/api/v1/auth/login")
            .then()
            .statusCode(200)
            .body("success", equalTo(true))
            .body("result.accessToken", notNullValue())
            .body("result.refreshToken", notNullValue())
            .body("result.registrationCompleted", equalTo(false))
            .extract()
            .path("result.accessToken");

        String refreshToken = given()
            .contentType(ContentType.JSON)
            .body(loginBody)
            .when()
            .post("/api/v1/auth/login")
            .then()
            .extract()
            .path("result.refreshToken");

        String completeBody = """
                              {
                                  "role": "CANDIDATE",
                                  "documentType": "CPF",
                                  "documentNumber": "12345678900"
                              }""";

        given()
            .contentType(ContentType.JSON)
            .body(completeBody)
            .when()
            .patch("/api/v1/auth/complete-registration")
            .then()
            .statusCode(403);

        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + accessToken)
            .body(completeBody)
            .when()
            .patch("/api/v1/auth/complete-registration")
            .then()
            .statusCode(200)
            .body("success", equalTo(true))
            .body("result.role", equalTo("CANDIDATE"))
            .body("result.documentType", equalTo("CPF"))
            .body("result.documentNumber", equalTo("12345678900"));

        given()
            .contentType(ContentType.JSON)
            .body(loginBody)
            .when()
            .post("/api/v1/auth/login")
            .then()
            .statusCode(200)
            .body("result.registrationCompleted", equalTo(true));

        String refreshBody = """
                             {
                                 "refreshToken": "%s"
                             }""".formatted(refreshToken);

        given()
            .contentType(ContentType.JSON)
            .body(refreshBody)
            .when()
            .post("/api/v1/auth/refresh")
            .then()
            .statusCode(200)
            .body("success", equalTo(true))
            .body("result.accessToken", notNullValue())
            .body("result.refreshToken", notNullValue());
    }
}
