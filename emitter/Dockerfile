# Base image for Go build
FROM golang:1.24 AS go-base

WORKDIR /app

# Copy Go module files and download dependencies
COPY emitter/go.mod emitter/go.sum ./
RUN go mod download

# Stage to install dependencies for gRPC and Protobuf
FROM go-base AS emitter

# Install protobuf compiler and gRPC plugins
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    && go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28.0 \
    && go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2.0

# Stage for building the emitter and generating protobuf Go files
FROM emitter AS emitter-protos

WORKDIR /app

# Copy the Go source files into the container
COPY emitter ./
COPY protos ./protos

# Run protoc to generate Go files from the proto files
RUN protoc -I=./protos --go_out=./protos --go-grpc_out=./protos ./protos/status.proto

RUN go get github.com/lib/pq


# Build the Go emitter binary
RUN go build -o emitter .

# Final image for running the compiled application
FROM golang:1.24

WORKDIR /app

# Copy the compiled binary and necessary files from the builder stage
COPY --from=emitter-protos /app/emitter /app/emitter

# Expose port for gRPC communication
EXPOSE 50051

# Run the Go emitter when the container starts
CMD ["./emitter"]
