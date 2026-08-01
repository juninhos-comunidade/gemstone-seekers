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
import static org.hamcrest.Matchers.notNullValue;

@Testcontainers
class CompanyIntegrationTest {

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
                    "name": "Admin User",
                    "email": "admin@example.com",
                    "password": "plainPassword123"
                }""";
        given().contentType(ContentType.JSON).body(registerBody).when().post("/api/v1/auth/register").then()
                .statusCode(201);

        String loginBody = """
                {
                    "email": "admin@example.com",
                    "password": "plainPassword123"
                }""";
        return given().contentType(ContentType.JSON).body(loginBody).when().post("/api/v1/auth/login").then()
                .statusCode(200).extract().path("result.accessToken");
    }

    @Test
    void shouldCreateCompanyAndReturnCreatedStatus() {
        String token = getAccessToken();
        String createBody = """
                {
                    "name": "Tech Corp",
                    "cnpj": "12345678000190"
                }""";
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).body(createBody).when()
                .post("/api/v1/companies").then().statusCode(201).body("success", equalTo(true))
                .body("message", equalTo("Company created successfully")).body("result.id", notNullValue())
                .body("result.name", equalTo("Tech Corp")).body("result.cnpj", equalTo("12345678000190"));
    }

    @Test
    void shouldRejectCreateWithoutAuthentication() {
        String createBody = """
                {
                    "name": "Tech Corp",
                    "cnpj": "12345678000190"
                }""";
        given().contentType(ContentType.JSON).body(createBody).when().post("/api/v1/companies").then().statusCode(403);
    }

    @Test
    void shouldFindAllCompanies() {
        String token = getAccessToken();
        String createBody1 = """
                {
                    "name": "Tech Corp",
                    "cnpj": "12345678000190"
                }""";
        String createBody2 = """
                {
                    "name": "Dev Inc",
                    "cnpj": "98765432000110"
                }""";
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).body(createBody1).when()
                .post("/api/v1/companies");
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).body(createBody2).when()
                .post("/api/v1/companies");

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).when().get("/api/v1/companies")
                .then().statusCode(200).body("success", equalTo(true)).body("result", hasSize(2));
    }

    @Test
    void shouldFindCompanyById() {
        String token = getAccessToken();
        String createBody = """
                {
                    "name": "Tech Corp",
                    "cnpj": "12345678000190"
                }""";
        String companyId = given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token)
                .body(createBody).when().post("/api/v1/companies").then().extract().path("result.id");

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).when()
                .get("/api/v1/companies/" + companyId).then().statusCode(200).body("success", equalTo(true))
                .body("result.id", equalTo(companyId)).body("result.name", equalTo("Tech Corp"))
                .body("result.cnpj", equalTo("12345678000190"));
    }

    @Test
    void shouldReturnNotFoundForNonexistentCompany() {
        String token = getAccessToken();
        String randomUuid = "00000000-0000-0000-0000-000000000000";
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).when()
                .get("/api/v1/companies/" + randomUuid).then().statusCode(404);
    }

    @Test
    void shouldUpdateCompany() {
        String token = getAccessToken();
        String createBody = """
                {
                    "name": "Old Name",
                    "cnpj": "12345678000190"
                }""";
        String companyId = given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token)
                .body(createBody).when().post("/api/v1/companies").then().extract().path("result.id");

        String updateBody = """
                {
                    "name": "New Name",
                    "cnpj": "12345678000190"
                }""";
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).body(updateBody).when()
                .put("/api/v1/companies/" + companyId).then().statusCode(200).body("success", equalTo(true))
                .body("result.name", equalTo("New Name")).body("result.cnpj", equalTo("12345678000190"));
    }

    @Test
    void shouldDeleteCompanyAndHideFromListing() {
        String token = getAccessToken();
        String createBody = """
                {
                    "name": "Tech Corp",
                    "cnpj": "12345678000190"
                }""";
        String companyId = given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token)
                .body(createBody).when().post("/api/v1/companies").then().extract().path("result.id");

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).when()
                .delete("/api/v1/companies/" + companyId).then().statusCode(200).body("success", equalTo(true))
                .body("message", equalTo("Company deleted successfully"));

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).when().get("/api/v1/companies")
                .then().statusCode(200).body("result", hasSize(0));

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).when()
                .get("/api/v1/companies/" + companyId).then().statusCode(404);
    }

    @Test
    void shouldRejectCreateWithDuplicateCnpj() {
        String token = getAccessToken();
        String createBody = """
                {
                    "name": "Tech Corp",
                    "cnpj": "12345678000190"
                }""";
        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).body(createBody).when()
                .post("/api/v1/companies").then().statusCode(201);

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + token).body(createBody).when()
                .post("/api/v1/companies").then().statusCode(409).body("success", equalTo(false));
    }
}
