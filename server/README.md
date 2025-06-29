# 🚁 DroneShield Backend - IoT Sensor Management System

A scalable NestJS backend service for managing IoT sensors with real-time status monitoring, software version management, and WebSocket-based live updates.

## 🏗️ Architecture Overview

This backend is designed to handle high-volume IoT sensor data with the following key architectural decisions:

### **Multi-Protocol Communication**

- **REST API**: For frontend data retrieval and software uploads
- **gRPC**: For high-performance sensor status updates from the emitter
- **WebSocket**: For real-time frontend updates via Socket.IO

### **Data Layer**

- **PostgreSQL**: Primary database with TypeORM for entity management
- **Redis**: Caching layer for sensor online status with TTL-based offline detection
- **File System**: Software PDF storage with version extraction

### **Scalability Features**

- **Database Indexing**: Optimised queries on sensor serial and online status
- **Redis TTL**: Efficient offline detection without database polling
- **Cron Jobs**: Background processing for sensor status management
- **Connection Pooling**: Optimised database and Redis connections

## 🚀 Features Implemented

### **Core Functionality**

✅ **Sensor Management**

- Database seeding with 100 sensors using UUID serials
- Paginated sensor listing with software version and online status
- Real-time online/offline detection via Redis TTL (10-minute default)

✅ **Software Version Control**

- PDF file upload with semantic version validation
- Version extraction from filename (e.g., `v1.0.3.pdf`)
- Software history tracking for sensor version changes
- Invalid version rejection (only accepts uploaded versions)

✅ **Real-time Communication**

- gRPC endpoint for sensor status updates (`DeviceStatusService.SendStatus`)
- WebSocket gateway for live frontend updates
- Automatic offline detection via scheduled cron job (every 2 minutes)

✅ **API Endpoints**

- `GET /sensors` - Paginated sensor list with filtering
- `POST /upload` - Multi-file software upload with validation

### **Data Models**

```typescript
// Sensor Entity
- id: number (Primary Key)
- serial: string (Unique, Indexed)
- isOnline: boolean (Indexed)
- softwareId: number (Foreign Key)
- createdAt: Date
- updatedAt: Date

// Software Entity
- id: number (Primary Key)
- version: string (Unique, Indexed)
- filePath: string
- originalFileName: string
- uploadedAt: Date

// SensorSoftwareHistory Entity
- id: number (Primary Key)
- sensorId: number (Foreign Key)
- softwareId: number (Foreign Key)
- reportedAt: Date
```

### **Performance Optimisations**

- **Database Indexing**: Serial and online status columns indexed
- **Redis Caching**: Sensor status with configurable TTL
- **Batch Updates**: Efficient offline sensor marking
- **Connection Reuse**: Optimised database and Redis connections

## 🛠️ Technology Stack

### **Core Framework**

- **NestJS 11**: Enterprise-grade Node.js framework
- **TypeScript**: Type-safe development
- **TypeORM**: Database ORM with migration support

### **Communication**

- **gRPC**: High-performance microservice communication
- **Socket.IO**: Real-time WebSocket updates
- **Express**: REST API endpoints

### **Data Storage**

- **PostgreSQL 13**: Primary relational database
- **Redis 7**: Caching and session management
- **File System**: Software file storage

### **Development Tools**

- **ESLint + Prettier**: Code quality and formatting
- **Docker**: Containerised deployment

## 🚀 Getting Started

### **Prerequisites**

- Node.js 23+
- Docker & Docker Compose
- PostgreSQL 13+
- Redis 7+

### **Environment Variables**

```bash
# Database
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_NAME=portal

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL=600

# Application
PORT=8000
SENSOR_STATUS_CRON="*/2 * * * *"
UPLOADS_DIR=/usr/app/uploads
```

## 📊 API Documentation

### **REST Endpoints**

#### `GET /sensors`

Returns paginated list of sensors with online status and software versions.

**Query Parameters:**

- `page` (number): Page number (default: 0)
- `limit` (number): Items per page (default: 10)

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "serial": "uuid-string",
      "version": "v1.0.3",
      "isOnline": true
    }
  ],
  "total": 100,
  "pageCount": 10
}
```

#### `POST /upload`

Upload software PDF files with version extraction.

**Request:** Multipart form data with `files` field

**Response:**

```json
{
  "success": true,
  "message": "Software uploaded successfully"
}
```

### **gRPC Service**

#### `DeviceStatusService.SendStatus`

Processes real-time sensor status updates.

**Request:**

```protobuf
message DeviceStatus {
  string serial = 1;
  string software_version = 2;
}
```

**Response:**

```protobuf
message StatusAck {
  string message = 1;
}
```

### **WebSocket Events**

#### `sensor-status-update`

Emitted when sensor status changes.

**Payload:**

```json
{
  "serial": "uuid-string",
  "version": "v1.0.3",
  "isOnline": true
}
```

## 🔧 Configuration

### **Cron Jobs**

- **Sensor Status Check**: Every 2 minutes (configurable via `SENSOR_STATUS_CRON`)
- **Offline Detection**: Based on Redis TTL expiration

### **Redis TTL**

- **Default**: 10 minutes (600 seconds)
- **Configurable**: Via `REDIS_TTL` environment variable

### **File Upload**

- **Supported Formats**: PDF files
- **Version Extraction**: From filename (e.g., `v1.0.3.pdf`)
- **Storage**: Local file system with Docker volume mapping

## 🔮 Future Enhancements & Production Features

### **With more time, the following enhancements would improve production readiness and scalability:**

1. **Authentication & Security**
   - JWT-based user authentication for client access
   - API key/token system for emitter auth
   - Rate limiting and request validation

2. **Performance & Scalability**
   - Message queue (Redis/RabbitMQ) to handle millions of sensor status updates
   - Database connection pooling optimisation
   - Redis clustering for high availability
   - Cloud storage (AWS S3) for uploaded files
   - Use cursor-based pagination instead of findAndCount for better scalability

3. **Testing & Quality**
   - Unit tests for services and DB interactions
   - E2E tests for critical user flows
   - Integration tests for database operations
   - Automated testing in CI/CD pipeline
