# ============================================
# GEMSTONE SEEKERS - MAKEFILE
# ============================================

COMPOSE_BASE    := docker/compose.yaml
COMPOSE_DEV     := docker/compose.override.yaml
COMPOSE_PROD    := docker/compose.prod.yaml
ENV_FILE        := --env-file .env

# ============================================
# DEV (local development — app runs via IDE)
# ============================================

.PHONY: dev
dev: ## Start postgres for local development (app runs via IDE)
	docker compose -f $(COMPOSE_BASE) $(ENV_FILE) up -d postgres

.PHONY: dev-down
dev-down: ## Stop local dev environment
	docker compose -f $(COMPOSE_BASE) $(ENV_FILE) down

.PHONY: dev-down-v
dev-down-v: ## Stop local dev environment and remove volumes
	docker compose -f $(COMPOSE_BASE) $(ENV_FILE) down -v

# ============================================
# STACK (fully containerized — app + infra)
# ============================================

.PHONY: stack-up
stack-up: ## Start full stack containerized (app + postgres)
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) up -d --build

.PHONY: stack-down
stack-down: ## Stop full containerized stack
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) down

.PHONY: stack-down-v
stack-down-v: ## Stop full containerized stack and remove volumes
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) down -v

# ============================================
# PROD
# ============================================

.PHONY: prod
prod: ## Start production environment
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) $(ENV_FILE) up -d

.PHONY: prod-down
prod-down: ## Stop production environment
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) $(ENV_FILE) down

# ============================================
# BUILD
# ============================================

.PHONY: build
build: ## Build application Docker image
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) build app

.PHONY: build-nc
build-nc: ## Build application Docker image without cache
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) build --no-cache app

# ============================================
# LOGS
# ============================================

.PHONY: logs
logs: ## Follow logs for all running services
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) logs -f

.PHONY: logs-app
logs-app: ## Follow logs for app service only
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) logs -f app

.PHONY: logs-db
logs-db: ## Follow logs for postgres service only
	docker compose -f $(COMPOSE_BASE) $(ENV_FILE) logs -f postgres

# ============================================
# UTILITIES
# ============================================

.PHONY: ps
ps: ## List running containers
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) ps

.PHONY: shell-app
shell-app: ## Open shell inside app container
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) exec app sh

.PHONY: shell-db
shell-db: ## Open psql inside postgres container
	docker compose -f $(COMPOSE_BASE) $(ENV_FILE) exec postgres psql -U ${DB_USERNAME} -d gemstone_seekers_db

# ============================================
# MAVEN
# ============================================

.PHONY: run
run: ## Run application locally via Maven
	./mvnw spring-boot:run

.PHONY: test
test: ## Run all tests
	./mvnw test

.PHONY: verify
verify: ## Run full Maven verify lifecycle
	./mvnw verify

.PHONY: package
package: ## Package application (skip tests)
	./mvnw package -DskipTests

# ============================================
# CLEAN
# ============================================

.PHONY: clean
clean: ## Clean Maven build artifacts
	./mvnw clean

.PHONY: docker-clean
docker-clean: ## Remove project containers, images and volumes
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) $(ENV_FILE) down -v --rmi all --remove-orphans

.PHONY: docker-purge
docker-purge: ## WARNING: Remove ALL Docker resources from the machine (containers, images, volumes, networks)
	docker system prune -a --volumes -f

# ============================================
# HELP
# ============================================

.PHONY: help
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' | sort

.DEFAULT_GOAL := help
