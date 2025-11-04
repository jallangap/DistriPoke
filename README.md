# DISTRIPO_KE (Distributed Pokedex Project)

This project implements a three-tier distributed architecture for an educational assignment, featuring a web frontend, a Node.js API backend, and a PostgreSQL database for persistent storage.

## Project Structure

* **Frontend (`frontend/`):** Static files (HTML, CSS, Vanilla JavaScript) served by Nginx. Handles user interface, login logic, and calls the Backend API.
* **Backend (`backend/`):** Node.js / Express API. Handles business logic, PokeAPI fetching, authentication, and database interaction using PostgreSQL.
* **Database (`db` service):** PostgreSQL container used to store persistent search history.

## How to Run (Local Docker Setup)

The entire application is managed by Docker Compose for easy local execution.

### Prerequisites

You must have  **Docker Desktop** installed and running on your machine.

### Execution (One Command)

1.  Open your terminal in the root directory of the project (where `docker-compose.yml` is located).
2.  Execute the following command. The `--build` flag ensures that the images are correctly built with the necessary PostgreSQL dependencies.

    ```bash
    docker-compose up --build
    ```

3.  The database will initialize, and the backend will wait 10 seconds to ensure the database is ready, preventing connection errors.
4.  Open your web browser and navigate to:

    ```
    http://localhost
    ```

### Login Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `12345` |

### Functionality

* **Pokedex Display:** Shows the first 151 Pokémon upon successful login.
* **Search:** Allows searching by Pokémon name (e.g., `pikachu`). Each successful search is logged to the PostgreSQL database.
* **History:** The "History" button retrieves and displays the 20 most recent search queries from the PostgreSQL database, confirming persistence.

---

## Final Step: Deployment to Render (Cloud)

To deploy this project to the cloud, all changes (including the PostgreSQL migration) must be pushed to GitHub before configuring the services in Render.