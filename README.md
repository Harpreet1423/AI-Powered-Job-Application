# JobFlow - AI-Powered Job Portal

A modern, full-stack job portal web application with AI-powered resume analysis, built with React, Node.js, and the Claude API.

## Features

- **Job Seekers**: Browse jobs, apply with resume upload, save jobs, track application status
- **Recruiters**: Post jobs, manage listings, review applicants, update application statuses
- **Admin**: Manage all users, jobs, and view platform analytics
- **AI Resume Analyzer**: Upload your resume for instant ATS compatibility scoring, keyword analysis, and section-by-section improvement suggestions powered by Claude AI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, shadcn/ui, Framer Motion |
| Backend | Node.js, Express.js |
| Database | SQLite (dev) / PostgreSQL (prod) with Prisma ORM |
| Auth | JWT with httpOnly cookies |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| File Upload | Multer (PDF validation, 5MB limit) |

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Quick Start

### 1. Clone and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment

```bash
# In the server directory, copy the example env file
cd server
cp ../.env.example .env
```

Edit `server/.env` with your values:
- `DATABASE_URL` - SQLite path (default works for local dev)
- `JWT_SECRET` - Change to a secure random string
- `ANTHROPIC_API_KEY` - Your Anthropic API key (optional - mock analysis works without it)
- `PORT` - Server port (default: 5000)

### 3. Set up the database

```bash
cd server
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Start development servers

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

The app will be available at **http://localhost:5173**

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | seeker@example.com | password123 |
| Recruiter | recruiter@example.com | password123 |
| Admin | admin@example.com | password123 |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List jobs (with search, filter, pagination)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (recruiter)
- `PUT /api/jobs/:id` - Update job (recruiter)
- `DELETE /api/jobs/:id` - Delete job (recruiter)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs
- `POST /api/jobs/:id/save` - Toggle save job (seeker)
- `GET /api/jobs/seeker/saved` - Get saved jobs (seeker)

### Applications
- `POST /api/applications` - Apply for job (seeker, multipart/form-data)
- `GET /api/applications/my-applications` - Get seeker's applications
- `GET /api/applications/job/:jobId` - Get applicants for job (recruiter)
- `PUT /api/applications/:id/status` - Update application status (recruiter)

### AI
- `POST /api/ai/analyze-resume` - Analyze resume (multipart/form-data)
- `GET /api/ai/analyses` - Get past analyses

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/jobs` - All jobs
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/jobs/:id` - Delete job

## Project Structure

```
├── server/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Seed data
│   ├── src/
│   │   ├── middleware/       # Auth & upload middleware
│   │   ├── routes/           # API route handlers
│   │   └── index.js          # Express server entry
│   └── uploads/              # Uploaded resumes
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/           # shadcn/ui base components
│   │   │   ├── layout/       # Navbar, Footer, DashboardLayout
│   │   │   ├── auth/         # Login, Register, ProtectedRoute
│   │   │   ├── jobs/         # JobCard, Filters, ApplicationModal
│   │   │   ├── dashboard/    # StatsCard, PostJobForm, etc.
│   │   │   └── ai/           # ResumeAnalyzer
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context (Auth)
│   │   └── lib/              # Utilities, API client
│   └── public/
└── .env.example
```

## Building for Production

```bash
# Build the frontend
cd client
npm run build

# Start the server in production mode
cd ../server
NODE_ENV=production npm start
```
