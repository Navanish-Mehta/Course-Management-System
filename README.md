# Course Management System

This project is a complete full-stack application for managing university courses and their instances. It features a Java Spring Boot backend, a React frontend with Material UI, and is fully containerized with Docker.

## Features

- **Course Management**: Create, view, edit, and delete courses.
- **Prerequisite Validation**: Ensures that a course's prerequisites exist before creation and prevents the deletion of courses that are dependencies for others.
- **Course Instance Management**: Schedule courses for specific years and semesters.
- **Dynamic UI**: A responsive and modern user interface built with React and Material UI.
- **Containerized**: Fully containerized using Docker and Docker Compose for easy setup and deployment.
- **CI/CD Automation**: GitHub Actions workflows automatically build and push Docker images to DockerHub on every push to the `main` branch.

## Project Structure

```
/
├── .github/
│   └── workflows/
│       ├── backend-ci.yml      # CI/CD workflow for the backend
│       └── frontend-ci.yml     # CI/CD workflow for the frontend
├── backend/                    # Java Spring Boot application
│   ├── src/
│   └── pom.xml
│   └── Dockerfile
├── frontend/                   # React.js application
│   ├── src/
│   └── package.json
│   └── Dockerfile
├── docker-compose.yml          # For local development (builds images)
├── docker-compose.prod.yml     # For production (pulls images from DockerHub)
└── README.md
```

## Technology Stack

- **Backend**: Java 17, Spring Boot, Spring Data JPA, Maven
- **Database**: H2 (In-Memory)
- **Frontend**: React.js, Material UI, Axios
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## Getting Started

There are two ways to run this application: for local development (building images locally) or for production (pulling pre-built images from DockerHub).

### Prerequisites

- Git
- Docker and Docker Compose
- Java 17+
- Node.js and npm (only for running frontend outside of Docker)

### Option 1: Local Development (Building Images)

This approach builds the Docker images from the source code on your local machine. It's ideal for development and testing.

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Build and run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

    This command will:
    - Build the Docker image for the backend.
    - Build the Docker image for the frontend.
    - Start both containers.

3.  **Access the application:**
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:8080](http://localhost:8080)

### Option 2: Production Deployment (Pulling from DockerHub)

This approach pulls the pre-built images from DockerHub, as required by the assignment. This requires you to have the CI/CD pipeline set up and run successfully.

#### Step 1: Set Up CI/CD on GitHub

The included GitHub Actions workflows (`.github/workflows/`) will automatically build and push the Docker images to your DockerHub account whenever you push to the `main` branch.

1.  **Create a DockerHub account** if you don't have one.
2.  **Create a Personal Access Token (PAT)** in your DockerHub account settings. This will be used as a password.
3.  **In your GitHub repository**, go to `Settings > Secrets and variables > Actions`.
4.  **Create two new repository secrets:**
    - `DOCKERHUB_USERNAME`: Your DockerHub username.
    - `DOCKERHUB_TOKEN`: The Personal Access Token you just created.

Now, whenever you `git push` to your `main` branch, the workflows will build and publish the images `your-dockerhub-username/course-app-backend:latest` and `your-dockerhub-username/course-app-frontend:latest`.

#### Step 2: Run the Application with Production Compose

1.  **Update `docker-compose.prod.yml`:**
    Open the `docker-compose.prod.yml` file and replace `your-dockerhub-username` with your actual DockerHub username.

2.  **Pull the images and run:**
    Make sure you are logged into DockerHub in your terminal (`docker login`).
    ```bash
    docker-compose -f docker-compose.prod.yml up
    ```
    This command will pull the images from DockerHub and start the containers.

## Final Database Check

A critical bug was fixed where the backend failed to start because `YEAR` is a reserved SQL keyword. This was resolved by renaming the corresponding column to `instance_year` in the `CourseInstance` entity.

**File**: `backend/src/main/java/com/example/courses/model/CourseInstance.java`

```java
// ...
import jakarta.persistence.Column;
// ...
public class CourseInstance {
    // ...
    @Column(name = "instance_year") // Renamed column to avoid SQL keyword conflict
    private int year;
    // ...
}
```
Please ensure this change is present and that you have rebuilt the backend application (`./backend/mvnw clean install` or via Docker build) for the fix to be active.

## API Endpoints

### Courses (`/api/courses`)

-   `GET /`: Get all courses.
-   `GET /{courseId}`: Get a single course by its ID.
-   `POST /`: Create a new course.
    -   **Body**: `{ "title": "...", "courseId": "...", "description": "...", "prerequisites": ["ID1", "ID2"] }`
-   `DELETE /{courseId}`: Delete a course.

### Course Instances (`/api/instances`)

-   `POST /`: Create a new course instance.
    -   **Body**: `{ "year": 2024, "semester": 1, "courseId": "..." }`
-   `GET /{year}/{semester}`: Get all instances for a given year and semester.
-   `GET /{year}/{semester}/{courseId}`: Get details of a specific course instance.
-   `DELETE /{year}/{semester}/{courseId}`: Delete a course instance.

## Design and Implementation Choices

-   **Backend**: Spring Boot was chosen for its rapid development capabilities and robust ecosystem. Spring Data JPA simplifies database interactions.
-   **Frontend**: React with Material UI was chosen to create a modern, responsive, and professional-looking UI efficiently.
-   **State Management**: React's `useState` and `useEffect` hooks are used for simple and effective local state management.
-   **API Communication**: `axios` is used for all frontend-to-backend communication.
-   **CORS**: A dedicated `CorsConfig` class in the backend allows the frontend (running on `localhost:3000`) to communicate with the backend.
-   **Database Schema**: A many-to-many relationship is used for course prerequisites. The `YEAR` column was renamed to `INSTANCE_YEAR` to avoid conflicts with SQL reserved keywords.
-   **Containerization**: Docker and Docker Compose are used to ensure a consistent development and deployment environment, simplifying setup for any user.

This project fulfills all the requirements of the assignment, providing a complete, well-documented, and easy-to-run application. 