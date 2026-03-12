FROM golang:1.24-alpine AS builder

WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build agent
RUN go build -o dso-agent cmd/dso-agent/*.go

# Build plugins
RUN cd cmd/plugins/dso-provider-aws && go build -o /app/dso-provider-aws main.go
RUN cd cmd/plugins/dso-provider-azure && go build -o /app/dso-provider-azure main.go
RUN cd cmd/plugins/dso-provider-huawei && go build -o /app/dso-provider-huawei main.go

FROM alpine:latest
WORKDIR /root/

# Copy binaries
COPY --from=builder /app/dso-agent /usr/local/bin/

# Make plugin directory and copy plugins
RUN mkdir -p /usr/local/lib/dso/plugins
COPY --from=builder /app/dso-provider-* /usr/local/lib/dso/plugins/

# Ensure the socket directory exists mapped
VOLUME ["/var/run"]

CMD ["dso-agent"]
