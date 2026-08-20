# Job Tracker Client

React frontend for the Job Application Tracker. Connects to a Django REST API backend.

**Live app:** https://job-tracker-client-nine.vercel.app/dashboard
**Backend repo:** [job-tracker-api](https://github.com/ranju024/job-tracker-api)

## Tech Stack

- React 19 + Vite
- Material UI
- Axios
- React Router

## Features

- User registration and login, with JWT authentication and protected routes
- Job applications list with search, status filtering (including an "Active"
  filter), and work-type filtering
- Application detail page with a read-only view by default, an explicit Edit
  button switches to an editable form, so nothing changes unless you choose to
  edit
- Back button (browser history) on the applications list and the application
  detail page
- Add, edit, and delete job applications, including company, title, URL,
  location, work type, salary range, source, status, and notes
- Interview scheduling per application (type, date/time, meeting link,
  location), only offered once an application reaches Screening,
  Interviewing, or Offered
- Dashboard with clickable stats: Total, Active, Upcoming interviews,
  Offers, and Rejected each deep-link to the applications list pre-filtered
  to match
- Dashboard "Upcoming interviews" list links straight through to the
  matching application
- Dashboard "Applications needing attention" section flags active
  applications with no update in 15+ days, each clickable through to that
  application, with a "View all" link to the filtered list once there are
  more than can fit on the dashboard

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

Vite only reads `.env` at startup, so restart the dev server after changing
it since saving the file alone won't apply the change.

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

Set `VITE_API_URL` as an environment variable in the Vercel project
settings, pointing to the deployed backend API URL.
