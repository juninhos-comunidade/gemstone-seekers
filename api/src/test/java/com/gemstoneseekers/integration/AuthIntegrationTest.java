package com.gemstoneseekers.integration;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class AuthIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
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
            .statusCode(HttpStatus.CREATED.value())
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
            .statusCode(HttpStatus.OK.value())
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
            .statusCode(HttpStatus.FORBIDDEN.value());

        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + accessToken)
            .body(completeBody)
            .when()
            .patch("/api/v1/auth/complete-registration")
            .then()
            .statusCode(HttpStatus.OK.value())
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
            .statusCode(HttpStatus.OK.value())
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
            .statusCode(HttpStatus.OK.value())
            .body("success", equalTo(true))
            .body("result.accessToken", notNullValue())
            .body("result.refreshToken", notNullValue());
    }
}
