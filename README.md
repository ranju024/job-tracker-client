# **Job Tracker Client**

React frontend for the Job Application Tracker. Connects to a Django REST API backend.

**Live app:** https://job-tracker-client-nine.vercel.app/dashboard
**Backend repo:** [job-tracker-api](https://github.com/ranju024/job-tracker-api)

## Tech Stack

- React 19 + Vite
- Material UI
- Axios
- React Router
- Tailwind CSS

## Features

- User registration and login
- JWT authentication with protected routes
- Job applications list with status filtering
- Add, edit, delete job applications
- Dashboard with stats

## Project Structure

```
job-tracker-client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── AddJob.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EditJob.jsx
│   │   ├── Jobs.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── vercel.json
```

## Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/ranju024/job-tracker-client.git
cd job-tracker-client
npm install
```

Create a `.env` file using `.env.example` and point it at your backend:

```
VITE_API_URL=your_backend_url_here
```

For local development against the Django API:

```
VITE_API_URL=http://127.0.0.1:8000
```

Start the dev server:

```bash
npm run dev
```

## Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## Deployment

Deployed on Vercel: https://job-tracker-client-nine.vercel.app/dashboard

Set `VITE_API_URL` as an environment variable in the Vercel project settings, pointing to the deployed backend API URL.
