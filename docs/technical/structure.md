# Project Structure

## Overview
The project is organized into distinct directories to separate concerns and improve maintainability.

## Directory Layout

### `/frontend`
Contains all client-side code and assets that are served to the user's browser.
- **HTML Files:** The structure of the pages (`index.html`, `about.html`, etc.).
- **CSS:** `style.css` for styling and layout.
- **JavaScript:** Scripts are located in `backend/` (specifically `script.js`).
- **Assets:** Images and media files (e.g., `model photos/`, logo images).

### `/backend`
Reserved for server-side logic and main application scripts.
- **`script.js`:** The main JavaScript file containing frontend logic (DOM manipulation, form handling, etc.). Moved here per user request.
- If the project migrates to a dynamic backend (e.g., Node.js API), server code belongs here.

### `/infra`
Contains infrastructure and deployment configuration.
- **`vercel.json`:** Configuration for Vercel deployment (Clean URLs, routing rules).

### `/docs`
Project documentation.
- **`/features`:** Explanations of specific site features (e.g., Clean URLs, Forms).
- **`/technical`:** Technical details about the project architecture (like this file).
