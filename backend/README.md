# FinTrack AI Backend

This directory contains the Node.js backend server for the FinTrack AI application. It provides a full suite of services including user authentication, data persistence, and secure communication with the Google Gemini API.

## Features

-   **User Authentication**: Securely manages user sessions with JSON Web Tokens (JWT).
-   **Data Persistence**: Uses `lowdb` to store all user data (transactions, goals, budget, etc.) in a simple `db.json` file.
-   **Secure API Calls**: Keeps your Google Gemini API key safe on the server.
-   **Production-Ready Security**: Implements a strict Cross-Origin Resource Sharing (CORS) policy in production to protect your API.
-   **SMS Parsing**: Provides an endpoint that accepts a `.txt` file, processes its content with AI, and returns structured financial data.
-   **Lightweight**: Uses Express.js for a minimal and efficient server setup.

---

## Setup and Execution Steps

Follow these steps to get the backend server running on your local machine.

### Step 1: Navigate to the Backend Directory

Open your terminal or command prompt and change your current directory to this `backend` folder.

```bash
cd backend
```

### Step 2: Install Dependencies

Run the following command to install all the necessary Node.js packages defined in `package.json`.

```bash
npm install
```

### Step 3: Create Environment File

You need to provide your secret keys in an environment file.

1.  Create a new file named `.env` inside this `backend` directory.
2.  Add the following lines to the `.env` file, replacing the placeholder values with your actual keys.

    ```env
    # Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey
    API_KEY=YOUR_GEMINI_API_KEY_HERE

    # A long, random string for securing authentication tokens.
    # You can generate one here: https://www.random.org/strings/
    JWT_SECRET=YOUR_SUPER_SECRET_RANDOM_STRING_HERE
    ```

### Step 4: Run the Server

Start the backend server with the following command:

```bash
node server.js
```

If everything is set up correctly, you will see a confirmation message in your terminal:

```
FinTrack AI backend is running on http://localhost:3001
```

The server is now ready to receive requests from the FinTrack AI frontend application. You can leave this terminal window running while you use the web app.

---

## Production Hosting

When deploying this backend to a hosting service like Render, Heroku, or Fly.io, you must set the following **environment variables** in your hosting provider's dashboard:

-   `API_KEY`: Your Gemini API Key.
-   `JWT_SECRET`: Your secret for JWT signing.
-   `CLIENT_URL`: The full URL of your deployed frontend application (e.g., `https://your-app-name.vercel.app`). This is required for security.
-   `NODE_ENV`: Set this variable to `production`. This activates the secure CORS policy and other production-level settings.