# Task Manager — Full Stack Task Management Application

## 🚀 Overview

This is a task management web application built using React (frontend) and Node.js/Express (backend) with MongoDB for data storage.
Users can signup, login, and manage their tasks, including:

✔ Create new tasks

✔ View tasks

✔ Update task details

✔ Filter tasks by priority / due date / status

✔ Secure authentication using JWT tokens

This repository contains both frontend and backend code.

## 🧠 Features

User Authentication: Signup / Login and JWT‑based secure API access

Task CRUD Operations: Add, edit, delete, view tasks

Filter Tasks: View all / pending / completed / priority filters

Responsive UI: Dashboard and modals for task data

React Router: Route management for nested views

## 🧩 Tech Stack

Part	Technology

Frontend	React, React Router, Axios

Backend	Node.js, Express

Database	MongoDB

Authentication	JWT (JSON Web Tokens)

## 🗂 Folder Structure
```
taskmanager
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── .env
│   ├── server.js
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.js
│   │   └── index.js
├── README.md
```
## 📥 Installation (Local Setup)

✅ Backend

Navigate to backend folder:
```
cd backend
```
Install dependencies:
```
npm install
```
Create a .env file with:
```
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
PORT=4010
```
Start server:
```
npm start
```
Your backend will run at ```http://localhost:4010.```

✅ Frontend

Navigate to frontend:
```
cd frontend
```
Install dependencies:
```
npm install
```
Start React development:
```
npm run dev
```
Your frontend will run at``` http://localhost:3000.```

## 👤 How to Use

Signup and login to get token

Store the token in localStorage

Frontend sends token in headers when creating or updating tasks

Dashboard automatically refreshes on create/update

## Future Enhancements

✔ Add pagination

✔ Add search tasks

✔ Add dark mode

✔ Add drag & drop reorder

✔ Add push notification
