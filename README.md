# 🛡️ Shelters Management Web App

A full-stack web application built at HIT to manage and monitor shelter locations on campus. Users can upload images, mark shelter locations, view shelter details, and report issues - all within a user-friendly interface.

## 📌 Features

* 📍 **Interactive Shelter Mapping** – Upload images of campus areas and mark shelter locations within them.
* 🛠️ **Shelter Info Management** – Add and edit details such as status, capacity, and accessibility for each shelter.
* 🚨 **Emergency Notifications** – Receive real-time notifications during emergencies (e.g., sirens).
* 📝 **Issue Reporting** – Report problems like damaged, locked, or full shelters.
* ⚡ **User-Friendly Interface** – Intuitive design for easy navigation and use.

---

## 🛠️ Tech Stack

### 🧑‍🎨 Frontend

* React
* Material UI
* TailwindCSS
* Vite (for fast build and dev server)

### ⚙️ Backend

* Node.js
* Express.js
* MySQL

---

## 🚀 Getting Started

### Prerequisites

* Node.js and npm installed
* MySQL server installed and running

---

### 🔧 Setup Instructions

#### 1. Clone the repository:

```bash
git clone https://github.com/ShirGanon/shelters-management.git
cd shelters-management
```

#### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory with the following content:

```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
PORT=3001
```

Then start the backend:

```bash
npm run dev
```

#### 3. Set up the frontend

```bash
cd ../client
npm install
npm run dev
```

Access the app at: [http://localhost:5173](http://localhost:5173)

---

## 🗂️ Project Structure

```
shelters-management/
├── client/               # Frontend
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/               # Backend
│   ├── routes/
│   ├── middlewares/
│   ├── .env
│   ├── server.js
│   └── package.json
```
