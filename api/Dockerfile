FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw clean package -DskipTests -B -Dskip.git.hooks=true

FROM eclipse-temurin:25-jre-alpine

RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

WORKDIR /app

RUN addgroup -S gemstone && adduser -S gemstone -G gemstone

COPY --from=builder /app/target/*.jar app.jar

RUN chown -R gemstone:gemstone /app

USER gemstone

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
