# Course Management System – Frontend

This is the frontend application for the **Course Management System**, built with React and Material UI.

## Features
- View, create, edit, and delete courses
- Manage course prerequisites
- Schedule and manage course instances
- Responsive and modern UI

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm start
   ```
3. The app will run at [http://localhost:3000](http://localhost:3000)

## Docker

To build and run the frontend with Docker:
```sh
docker build -t course-management-frontend .
docker run -p 3000:80 course-management-frontend
```

---

**For full-stack deployment, use the `docker-compose.yml` from the backend repository.**
