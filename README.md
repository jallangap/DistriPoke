Pokedex Distributed Project

This project is a simple distributed application created for educational purposes. It consists of a vanilla JavaScript frontend and a Node.js/Express/SQLite backend.

How to Run

You will need two terminal windows for this.

Terminal 1: Run the Backend

Navigate to the backend directory:

cd backend


Install the dependencies:

npm install


Start the backend server:

npm start


The server will start on http://localhost:3000. It will also create a pokedex.db file in this directory to store the search history.

Terminal 2: Run the Frontend

The frontend is just static files (HTML, CSS, JS). You need a simple web server to run it. The easiest way is to use the serve package or a VS Code extension.

Method A: Using serve (Recommended)

Install serve globally (if you don't have it):

npm install -g serve


Navigate to the frontend directory:

cd frontend


Serve the files (the -l 5000 part runs it on port 5000, but any port other than 3000 is fine):

serve -l 5000


Open your browser and go to http://localhost:5000.

Method B: Using VS Code Live Server Extension

Install the "Live Server" extension from the VS Code marketplace.

In VS Code, open the frontend folder.

Right-click on index.html and select "Open with Live Server".

This will automatically open your browser to the correct page.

How to Use

Open the application in your browser (e.g., http://localhost:5000).

You will see the login page.

Enter admin as the user and 12345 as the password.

You will be redirected to the Pokedex, which will load the first 151 Pokemon.

Use the search bar at the bottom to find a specific Pokemon by name (e.g., pikachu, charizard).

Every search you make will be saved in the pokedex.db file on the backend.

Click "Show All" to return to the full list.