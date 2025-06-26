# 🧪 Backend Technical Task – DroneShield Portal

You are tasked with building a scalable backend service using NestJS to support a simulated IoT sensor management system. The system is composed of multiple containers, orchestrated via a docker-compose.yml file. Each container serves a distinct purpose and must not be modified — with one small exception in the Emitter container (see below for details).

The application simulates a real-world scenario where thousands (and eventually millions) of remote IoT sensors report their current state back to a central server. Each sensor is uniquely identified by a serial number — this can be a UUID or any randomly generated string. The core functionality of the system includes:
  
  - Viewing Sensor Status: Users can access a frontend UI to see a paginated list of all sensors, along with the current software version running on each device.
  - Sensor Activity Monitoring: The backend receives real-time gRPC payloads from a mock sensor "Emitter", which indicate which sensors are currently online and what software version they’re reporting. Upon receiving this data, the backend must validate the reported software version against the software versions that have previously been uploaded through the system. If the reported version does not match an existing uploaded version, it must not be persisted to the database for that sensor — only valid, known versions should be stored.
  - Online/Offline Detection: When a sensor sends a gRPC message, it should be marked as "online". The backend must also determine when a sensor is considered offline based on the absence of updates over time — the criteria for this is up to you to define and implement.
  - Software Uploading: Users can upload software files (e.g. .pdf placeholder files). Each uploaded file should be stored, and relevant metadata (such as the version, file path, and upload timestamp) should be persisted in the database.

Your backend should expose endpoints to support these features, power the frontend, and handle real-time updates via WebSockets so the UI reflects sensor status changes without needing full refreshes.

This system must be designed with scalability and performance in mind, as it will ultimately support a very large volume of concurrently active devices and file uploads.

## 🧱 Project Structure

You’ll be working within an existing environment consisting of the following containers:

### 🔹 DB

A PostgreSQL container that stores all persistent data. It is up to you to decide the best structure of your DB schema.

### 🔹 Emitter

A gRPC-based sensor simulator (“Emitter”) is responsible for mimicking real-world sensor activity. It periodically selects random sensor serials from the database and emits status payloads to the backend. Each payload represents a sensor reporting its current state and includes the following key data:

  - Sensor Serial Number: This is a unique identifier for each sensor in the system. It acts as the primary way to identify and track individual sensors. The serial can take the form of a UUID, a randomly generated string, or any consistent format that guarantees uniqueness across all devices.
  - Current Software Version: This field represents the version of software the sensor claims to be running. It is typically a string such as v1.0.3 or 4.2.0-beta, and must correspond to a version that has previously been uploaded via the client interface. If the backend receives a version that has not been uploaded, it must ignore it and not persist it to the database, as the version is considered invalid.

These payloads allow the backend to determine which sensors are online and what software they are running, while also ensuring data consistency by only accepting known software versions.

##### 🔒 Important:

You must not modify any code within this container except for a single line to connect to your backend:
`emitter/main.go::103 – Update this line to point to your backend service.`

### 🔹 Client

A minimal frontend UI that allows users to:
  - View all sensors and their associated software versions
  - Upload software files that will be related to all sensors. These software pdf files should be attached to the same email that sent you this test. If not please reach out.

## 🧠 Your Task: Build the Backend Service

Develop a NestJS-based API that can:

1. Serve the frontend’s data needs

2. Process real-time sensor data via gRPC

3. Manage and track the state of devices in a scalable and performance-oriented manner

## ✅ Functional Requirements

1. Design a scalable database schema
  - Your schema must support current features but also scale efficiently to support millions of sensors.
  - The only strict requirement: there must be a table named sensor with a column serial — this is used by the emitter to simulate payloads.

2. Seed the database with at least 100 sensors
  - You can use any method you prefer for seeding.

3. Build the following API endpoints:

`GET /sensors`
  - Returns a paginated list of sensors
  - Should include current software version and online/offline status

`POST /upload`
  - Accepts multiple software .pdf files
  - Stores the files and any relevant metadata (e.g., version, file path, upload date, etc.). The software version can be retrieved from the file name.
  - Design your DB schema and storage method for these files as you see fit but remember each sensor will have access to this software once it has been uploaded.
  - Validates the software version is a semantic version.

4. Handle incoming gRPC payloads from the emitter:
  - Update the corresponding sensor's software version and online status in the DB
  - Expose the updated data to the frontend via a websocket connection
  - If the software version is yet to be uploaded to the DB but a device is reporting that software version then do not update its software version but still consider it online.

5. Offline logic:
  - You must determine and implement your own logic for when a sensor should be considered offline.
  - This decision should be made on the backend and visualized on the FE.

6. Please list any features, optimisations, or architectural decisions you would have implemented with more time.

## ⚙️ Running the System

Your application must be runnable with a single command from the project root:

```
docker compose up --build
```

## 🚫 Restrictions & Flexibility

  - ❗ Do not modify the db, client, or emitter containers (except for the one connection line in emitter/main.go::103)
  - ✅ You can infer the required response structures from the frontend behaviour
  - ✅ If you believe a more efficient API structure or payload format would better support the frontend, feel free to modify the response formats from the backend accordingly — as long as the frontend continues to work.

## 🚀 Expectations

  - Scalability should be a core focus throughout your solution.
  - Your code should be clean, modular, and production-oriented.
  - Database queries, websocket handling, and gRPC processing should be performance-conscious.
  - This is your chance to impress us please do not waste the opportunity.

## 📦 Submission Instructions

Please create a private GitHub repository using this project as your base. Once you have completed the task:

1. Push your final code to the private repository. Feel free to commit and push your progress regularly — we’re also interested in seeing how you manage version control and interact with GitHub throughout the process.

2. Invite the following GitHub users as collaborators so we can review your submission:
  - harrygturner
  - OliFleming
  - devbks
  - basinghse
  - pranabamatya

3. Once access has been granted, notify us directly so we can begin the review process.


Thank you, and good luck! 🚀
