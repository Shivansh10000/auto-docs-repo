# Notes App

A simple notes application built with React, Node.js, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on default port 27017)

## Setup

1. Install backend dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Features

- Select from pre-created users (user1, user2, user3)
- Add notes with title and content
- View all notes for the selected user
- Delete notes
- Notes are persisted in MongoDB

## Project Structure

- `server.js` - Backend server with Express and MongoDB
- `client/` - React frontend application
  - `src/App.js` - Main React component
  - `src/App.css` - Styling for the application 