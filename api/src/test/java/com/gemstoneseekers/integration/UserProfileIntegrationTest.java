package com.gemstoneseekers.integration;

import com.gemstoneseekers.GemstoneSeekersApplication;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.DockerClientFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

class UserProfileIntegrationTest {

    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4");

    private static ConfigurableApplicationContext context;
    private static int port;

    @BeforeAll
    static void setup() {
        Assumptions.assumeTrue(DockerClientFactory.instance().isDockerAvailable(), "Docker is not available");
        postgres.start();
        context = new SpringApplicationBuilder(GemstoneSeekersApplication.class).run("--spring.profiles.active=test",
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
        if (postgres.isRunning()) {
            postgres.stop();
        }
    }

    @BeforeEach
    void setUp() throws SQLException {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;

        DataSource ds = context.getBean(DataSource.class);
        try (Connection conn = ds.getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("""
                    TRUNCATE TABLE candidate_links, candidate_languages, experiences, educations,
                    certifications, projects, recruiters, candidates, addresses, companies, users CASCADE
                    """);
        }
    }

    @Test
    void shouldRejectProfileWithoutAuthentication() {
        given().contentType(ContentType.JSON).when().get("/api/v1/profile").then().statusCode(401);
    }

    @Test
    void shouldReturnCandidateProfileAfterAuthenticationAndCompletion() {
        AuthenticatedCandidate authenticatedCandidate = registerCompleteAndLoginCandidate();

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + authenticatedCandidate.token()).when()
                .get("/api/v1/profile").then().statusCode(200).body("success", equalTo(true))
                .body("message", equalTo("Candidate profile retrieved successfully"))
                .body("result.candidate.user.email", equalTo(authenticatedCandidate.email()))
                .body("result.candidate.phone", equalTo("+5511999999999"))
                .body("result.candidate.summary", equalTo("Java Developer")).body("result.address", nullValue());
    }

    @Test
    void shouldUpdateCandidatePersonalInfoAndReturnUpdatedProfile() {
        AuthenticatedCandidate authenticatedCandidate = registerCompleteAndLoginCandidate();

        String updateBody = """
                {
                    "name": null,
                    "password": null,
                    "documentType": null,
                    "documentNumber": null,
                    "phone": "+5511888888888",
                    "summary": "Updated summary"
                }""";

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + authenticatedCandidate.token())
                .body(updateBody).when().patch("/api/v1/profile/user").then().statusCode(200)
                .body("success", equalTo(true)).body("message", equalTo("User info updated successfully"))
                .body("result.candidate.phone", equalTo("+5511888888888"))
                .body("result.candidate.summary", equalTo("Updated summary"));
    }

    @Test
    void shouldUpdateCandidateAddressAndReturnUpdatedProfile() {
        AuthenticatedCandidate authenticatedCandidate = registerCompleteAndLoginCandidate();

        String addressBody = """
                {
                    "zipCode": "01000-000",
                    "street": "Paulista Avenue",
                    "number": "1000",
                    "neighborhood": "Bela Vista",
                    "complement": "10th floor",
                    "location": {
                        "city": "São Paulo",
                        "state": "São Paulo",
                        "country": "Brazil"
                    }
                }""";

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + authenticatedCandidate.token())
                .body(addressBody).when().patch("/api/v1/profile/address").then().statusCode(200)
                .body("success", equalTo(true)).body("message", equalTo("Candidate address updated successfully"))
                .body("result.address.zipCode", equalTo("01000-000"))
                .body("result.address.street", equalTo("Paulista Avenue"))
                .body("result.address.number", equalTo("1000"))
                .body("result.address.neighborhood", equalTo("Bela Vista"))
                .body("result.address.complement", equalTo("10th floor"))
                .body("result.address.city.name", equalTo("São Paulo")).body("result.address.city.stateId", equalTo(1));
    }

    @Test
    void shouldAddAndDeleteCandidateLink() {
        AuthenticatedCandidate authenticatedCandidate = registerCompleteAndLoginCandidate();

        String addBody = """
                {
                    "name": "GitHub",
                    "url": "https://github.com/john"
                }""";

        UUID linkId = UUID.fromString(given().contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + authenticatedCandidate.token()).body(addBody).when()
                .post("/api/v1/profile/links").then().statusCode(200).body("success", equalTo(true))
                .body("message", equalTo("Link added successfully")).body("result.candidate.links", notNullValue())
                .body("result.candidate.links.size()", equalTo(1)).extract().path("result.candidate.links[0].id"));

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + authenticatedCandidate.token()).when()
                .delete("/api/v1/profile/links/" + linkId).then().statusCode(200).body("success", equalTo(true))
                .body("message", equalTo("Link deleted successfully"))
                .body("result.candidate.links.size()", equalTo(0));
    }

    private AuthenticatedCandidate registerCompleteAndLoginCandidate() {
        String email = "candidate-" + UUID.randomUUID() + "@example.com";

        String registerBody = """
                {
                    "name": "John Doe",
                    "email": "%s",
                    "password": "plainPassword123"
                }""".formatted(email);

        given().contentType(ContentType.JSON).body(registerBody).when().post("/api/v1/auth/register").then()
                .statusCode(201);

        String loginBody = """
                {
                    "email": "%s",
                    "password": "plainPassword123"
                }""".formatted(email);

        String initialToken = given().contentType(ContentType.JSON).body(loginBody).when().post("/api/v1/auth/login")
                .then().statusCode(200).extract().path("result.accessToken");

        String completeBody = """
                {
                    "role": "CANDIDATE",
                    "documentType": "CPF",
                    "documentNumber": "12345678900",
                    "phone": "+5511999999999",
                    "summary": "Java Developer"
                }""";

        given().contentType(ContentType.JSON).header("Authorization", "Bearer " + initialToken).body(completeBody)
                .when().patch("/api/v1/auth/complete-registration").then().statusCode(200);

        String token = given().contentType(ContentType.JSON).body(loginBody).when().post("/api/v1/auth/login").then()
                .statusCode(200).extract().path("result.accessToken");
        return new AuthenticatedCandidate(email, token);
    }

    private record AuthenticatedCandidate(String email, String token) {
    }
}
