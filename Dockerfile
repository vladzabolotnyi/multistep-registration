FROM golang:1.24.4-alpine AS backend_builder

WORKDIR /app

RUN apk add --no-cache gcc musl-dev git

COPY go.mod go.sum ./
RUN go mod download

# Copy backend source code
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api/main.go

# Frontend build stage
FROM node:20-alpine AS frontend_builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .

RUN npm run build

FROM alpine:3.20.1 AS backend_prod

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=backend_builder /app/main .

COPY --from=backend_builder /app/internal/database/migrations ./migrations

COPY --from=frontend_builder /frontend/dist ./frontend/dist

EXPOSE ${PORT}

CMD ["./main"]

FROM node:23-alpine AS frontend_prod

RUN npm install -g serve

COPY --from=frontend_builder /frontend/dist /app/dist

EXPOSE 5173

CMD ["serve", "-s", "/app/dist", "-l", "5173"]
