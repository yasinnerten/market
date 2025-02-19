# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install necessary build tools and backup dependencies
RUN apk add --no-cache gcc musl-dev postgresql-client curl

# Create necessary directories with fixed paths
RUN mkdir -p /app/uploads /app/logs /app/backups

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -o main ./cmd/api

# Make backup script executable
RUN chmod +x /app/scripts/backup.sh

# Final stage
FROM alpine:latest

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache postgresql-client curl tzdata

# Create necessary directories in final stage
RUN mkdir -p /app/uploads /app/logs /app/backups

# Copy binary and necessary files from builder
COPY --from=builder /app/main .
COPY --from=builder /app/scripts/backup.sh /app/scripts/
COPY --from=builder /app/migrations /app/migrations

# Create non-root user
RUN adduser -D appuser && \
    chown -R appuser:appuser /app && \
    chmod -R 755 /app/uploads /app/logs /app/backups

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["./main"]
