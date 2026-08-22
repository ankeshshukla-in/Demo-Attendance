# Attendance Management System

A full-stack attendance management system built with the MERN stack.

## Features
- Student registration and management
- Mark attendance by date
- Present/absent status with one record per student per day
- Attendance percentage dashboard
- Search students and filter by date
- REST API with Express and MongoDB
- React frontend with responsive UI

## Structure
- `backend/` — Express API, Mongoose models and routes
- `frontend/` — React + Vite client

## Run locally

### Backend
```bash
cd backend
npm install
npm run dev
```
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/attendance_management
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend expects the API at `http://localhost:5000/api`.
