# LibSwap

Library Management and Student Book Swapping System

## SIT725 Docker Deployment

This repository contains my individual Dockerised version of the LibSwap group project for SIT725.

The application uses:

- Node.js and Express for the server
- MongoDB Atlas for database storage
- Docker for containerisation
- JWT authentication for protected user functionality

The Docker container runs the application on port `3000` and receives sensitive configuration through environment variables at runtime.

---

## Student Details Endpoint

A REST endpoint has been added for the individual Docker assessment.

Endpoint:

```text
GET /api/student
```

After the application is running, open:

```text
http://localhost:3000/api/student
```

Expected response:

```json
{
  "name": "Manya Mahajan",
  "studentId": "223222623"
}
```

---

## Prerequisites

Before running the application, install:

- Git
- Docker Desktop

Docker Desktop must be running before the Docker commands below are executed.

Node.js does not need to be installed on the host machine because the required Node.js environment and dependencies are installed inside the Docker image.

---

## 1. Clone the Repository

Clone the repository:

```bash
git clone https://github.com/manya0033/LibSwap.git
```

Move into the project directory:

```bash
cd LibSwap
```

---

## 2. Environment Configuration

Sensitive configuration values are not stored in the public GitHub repository.

The repository contains an `.env.example` file showing the required environment variables.

Create a new file named:

```text
.env
```

The file should use the following structure:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### MongoDB Configuration

`MONGODB_URI` must contain a valid MongoDB Atlas connection string.

For assessment, the MongoDB connection string required by the marker will be provided privately through the OnTrack submission rather than being committed to this public repository.

Replace:

```text
your_mongodb_atlas_connection_string_here
```

with the connection string supplied with the assessment submission.

### JWT Configuration

Set `JWT_SECRET` to a secure string used to sign authentication tokens.

For example:

```env
JWT_SECRET=your_secure_private_jwt_secret
```

The `.env` file is excluded from both Git and the Docker image to prevent credentials from being published.

---

## 3. Build the Docker Image

From the root directory of the project, run:

```bash
docker build -t libswap-hd .
```

Docker will:

1. Use Node.js 22 Alpine as the base image.
2. Create the `/app` working directory.
3. Copy the project package files.
4. Install dependencies using `npm ci`.
5. Copy the application source code.
6. Expose port `3000`.
7. Configure the container to start the application using `npm start`.

A successful build creates an image named:

```text
libswap-hd
```

---

## 4. Run the Docker Container

Run:

```bash
docker run --name libswap-hd-container --env-file .env -p 3000:3000 libswap-hd
```

The command:

- creates a container named `libswap-hd-container`
- supplies environment variables from `.env`
- maps host port `3000` to container port `3000`
- starts the `libswap-hd` Docker image

When startup is successful, the terminal should display:

```text
Connected to MongoDB
Server is running on http://localhost:3000
```

---

## 5. Verify the Application

### Server Check

Open:

```text
http://localhost:3000/
```

Expected response:

```text
LibSwap server is running
```

### Student Identity Check

Open:

```text
http://localhost:3000/api/student
```

Expected response:

```json
{
  "name": "Manya Mahajan",
  "studentId": "223222623"
}
```

### Database Functionality Check

Open:

```text
http://localhost:3000/api/books
```

A successful response returns the library catalogue data stored in MongoDB.

This verifies that the Dockerised application can communicate successfully with the MongoDB database.

### Catalogue UI - End-to-End Functionality

Open:

```text
http://localhost:3000/catalogue.html
```

The catalogue page displays library books retrieved from the `/api/books` endpoint and stored in MongoDB Atlas.

The interface supports:

- searching by title, author or genre
- filtering by genre
- filtering by availability
- sorting by title or author

Successfully loading and interacting with this page demonstrates the complete application flow from the browser frontend through the Dockerised Express server to the MongoDB-backed `/api/books` endpoint.

---

## Authentication Endpoints

The application also provides authentication functionality.

### Register User

```text
POST /api/auth/register
```

### Login User

```text
POST /api/auth/login
```

### Authenticated User

```text
GET /api/auth/me
```

The `/api/auth/me` endpoint requires a valid JWT authentication token.

---

## Available Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check that the server is running |
| GET | `/catalogue.html` | Open the database-backed catalogue interface |
| GET | `/api/student` | Return student name and student ID |
| GET | `/api/books` | Retrieve library catalogue data from MongoDB |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Verify an authenticated user |

---

## Stop the Container

To stop the running application, press:

```text
Ctrl + C
```

Alternatively, from another terminal run:

```bash
docker stop libswap-hd-container
```

---

## Start the Existing Container Again

If the container has already been created and only needs to be restarted, run:

```bash
docker start -a libswap-hd-container
```

---

## Remove the Existing Container

If a new container needs to be created using the same name, first remove the old container:

```bash
docker rm libswap-hd-container
```

Then run the application again:

```bash
docker run --name libswap-hd-container --env-file .env -p 3000:3000 libswap-hd
```

---

## Rebuild After Code Changes

If application code is changed, rebuild the Docker image:

```bash
docker build -t libswap-hd .
```

Then remove the previous container if necessary:

```bash
docker rm libswap-hd-container
```

Run the updated image:

```bash
docker run --name libswap-hd-container --env-file .env -p 3000:3000 libswap-hd
```

---

## Security

Sensitive credentials are not hardcoded into the Dockerfile or application source code.

The following files are excluded from the Docker build context:

```text
.env
.env.*
```

The `.env.example` file is intentionally retained as a template because it contains placeholders rather than real credentials.

Runtime configuration is supplied using:

```bash
--env-file .env
```

This allows the application to access MongoDB and authentication configuration without embedding secrets inside the Docker image or publishing them to GitHub.

---

## Troubleshooting

### Docker is not running

If a Docker command cannot connect to the Docker engine, open Docker Desktop and wait until it has fully started.

### Container name already exists

If Docker reports that `libswap-hd-container` already exists, remove it:

```bash
docker rm libswap-hd-container
```

If it is still running, stop it first:

```bash
docker stop libswap-hd-container
docker rm libswap-hd-container
```

Then run the application again.

### MongoDB connection fails

Check that:

- the `.env` file exists in the project root
- `MONGODB_URI` contains the correct MongoDB Atlas connection string
- the machine has internet access
- the MongoDB Atlas network/database configuration permits the connection

---

## Docker Files

### Dockerfile

The `Dockerfile` defines the Node.js environment, installs application dependencies and starts the LibSwap server.

### .dockerignore

The `.dockerignore` prevents unnecessary or sensitive local files such as `.env`, `node_modules` and Git metadata from being copied into the Docker image.

### .env.example

The `.env.example` file documents the required environment variables without exposing real credentials.

---

## Author

Manya Mahajan  
Student ID: 223222623  
SIT725 - Applied Software Engineering