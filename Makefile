all: build test

DB_CONTAINER_NAME := registration-postgres
DB_IMAGE := postgres:15-alpine

build:
	@echo "Building..."
	
	@go build -o main cmd/api/main.go

run:
	@go run cmd/api/main.go &
	@npm install --prefer-offline --no-fund --prefix ./frontend
	@npm run dev --prefix ./frontend

docker-run:
	@if docker compose up --build 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose up --build; \
	fi

docker-down:
	@if docker compose down 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose down; \
	fi

test:
	@echo "Testing..."
	@go test ./... -v -race

clean:
	@echo "Cleaning..."
	@rm -f main

watch:
	@if command -v air > /dev/null; then \
            air; \
            echo "Watching...";\
        else \
            read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
            if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
                go install github.com/air-verse/air@latest; \
                air; \
                echo "Watching...";\
            else \
                echo "You chose not to install air. Exiting..."; \
                exit 1; \
            fi; \
        fi

db-up:
	@echo "Starting PostgreSQL container: $(DB_CONTAINER_NAME)..."
	docker run -d \
		--name $(DB_CONTAINER_NAME) \
		-p 5432:5432 \
		-e POSTGRES_DB=registration_db \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		--health-cmd="pg_isready -U postgres" \
		--health-interval=10s \
		--health-timeout=5s \
		--health-retries=5 \
		--health-start-period=30s \
		$(DB_IMAGE)

db-down:
	@echo "Stopping and removing container: $(DB_CONTAINER_NAME)..."
	-docker stop $(DB_CONTAINER_NAME) 2>/dev/null || true
	-docker rm $(DB_CONTAINER_NAME) 2>/dev/null || true

.PHONY: all build run test clean watch docker-run docker-down itest db-up db-down
