Pokedex Distributed Project (DistriPoke)

This project is a simple distributed application consisting of a Node.js/Express backend, a vanilla JavaScript frontend, and a persistent SQLite database for storing search history.

It is designed to run locally using Docker Compose and is ready to be deployed to platforms like Render.

1. Project Stack

Frontend (Containerized by Nginx): HTML, CSS (Tailwind classes), and Vanilla JavaScript.

Backend (Containerized by Node.js): Node.js, Express, and SQLite3 (for search history).

Database: SQLite (file-based).

2. How to Run Locally (Using Docker Compose)

The entire application runs using one single command, thanks to the provided docker-compose.yml.

Prerequisites

You must have Docker Desktop installed and running on your system.

Steps

Open your terminal in the root directory of the project (where docker-compose.yml is located).

Build and Run: Execute the following command. This builds the images, installs the backend dependencies (inside the Linux container), and starts both services:

docker-compose up


Access the Application: Once the terminal logs show "Backend server running on http://localhost:3000" and the Nginx server is ready, open your web browser and go to:

http://localhost


Stop the Project: Press Ctrl + C in the terminal and run docker-compose down to stop and remove the running containers.

3. How to Use the App

Login: Use the default credentials: User: admin / Password: 12345.

Functionality:

The home screen loads the first 151 Pokémon initially.

Use the search bar to look up Pokémon by name (e.g., pikachu).

Every successful search is saved to the database.

Click the "History" button to view a list of all successful searches saved in the SQLite database.

Click the "Show All" button to refresh the main list.

4. Deployment to Render (Next Steps)

This project is configured to be deployed as two separate services on Render:

Pokedex-API (Web Service): Deployed from the backend folder.

Pokedex-App (Static Site): Deployed from the frontend folder.

Note: Before deploying the Static Site, remember to update the BACKEND_URL in frontend/login.js and frontend/pokedex.js with the public URL assigned by Render to your Pokedex-API service.
