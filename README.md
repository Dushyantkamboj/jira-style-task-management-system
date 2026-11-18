# 🚀 JiraFlow — Production-Ready Jira-Style Task Management System

An enterprise-grade, full-stack Task Management System modeled after Atlassian Jira, built with the **MERN Stack** (MongoDB Atlas, Express.js, React, Node.js), Tailwind CSS, `@hello-pangea/dnd`, and fully containerized with **Docker** & **Nginx**.

---

## 🌟 Key Features

### 1. 🔐 User Authentication & Session Management
- **Registration & Validation**: Full name, email, password, and password confirmation with client and server-side validation.
- **JWT Session Security**: Secure JSON Web Tokens with salted Bcrypt password hashing (10 salt rounds).
- **Protected Endpoints**: Interceptor-based authentication attaching Bearer tokens to all requests.
- **Role-Based Access Control**:
  - `admin` (Lead Architect / PM permissions)
  - `member` (Engineer / Contributor permissions)
- **Session Persistence**: Automatic session restoration on reload and graceful 401 handling.
- **One-Click Demo Accounts**: Pre-configured instant logins for evaluation.

### 2. 📋 Jira-Style Workflow & Kanban Board
- **5 Exact Workflow Columns**:
  1. `Idea` — Newly proposed tasks or feature discussions.
  2. `To Do` — Approved tasks prioritized for active development.
  3. `In Progress` — Tasks actively being worked on by engineers.
  4. `In Review` — Tasks awaiting peer review, QA testing, or sign-off.
  5. `Completed` — Successfully tested and shipped tasks.
- **Drag-and-Drop Experience**: Smooth 60fps card dragging powered by `@hello-pangea/dnd`.
- **Optimistic UI Updates**: Immediate visual placement followed by asynchronous database synchronization, with automatic rollback if an error occurs.
- **User Permission Guards**: Only assigned users, task creators, or administrators can transition issue statuses.

### 3. 🎯 Complete Task CRUD & Rich Details
- **Issue Creation**:
  - **Required**: Task Title, Task Description
  - **Optional**: Priority (`Low`, `Medium`, `High`, `Critical`), Due Date, Assignee, Status, Labels/Tags, and Attachments.
- **Jira Key Generation**: Automatic sequential issue identifier (e.g. `JIRA-101`, `JIRA-102`).
- **Audit Log & Status History**: Tracks every workflow transition: who moved the task, previous status, new status, timestamp, and transition notes.
- **Quick Search & Multi-Filters**: Filter by text search, priority, assignee, "Only My Issues" toggle, and tags.
- **Permanent Deletion**: Protected modal confirmation preventing accidental data loss.

### 4. 📎 File Attachment Management
- **Supported File Types**:
  - Images (`PNG`, `JPG`, `JPEG`, `WEBP`, `GIF`, `SVG`)
  - Documents (`PDF`, `DOC`, `DOCX`, `TXT`, `RTF`)
  - Spreadsheets & Data (`XLS`, `XLSX`, `CSV`, `JSON`)
  - Archives (`ZIP`)
- **Direct Previews**: Image thumbnail previews directly inside the issue detail modal.
- **Safe Downloads**: Download attachments with original file names.
- **Upload at Any Time**: Attach files during task creation or anytime from the issue detail modal.

### 5. 📊 Real-Time Analytics Dashboard
- **6 KPI Overview Cards**:
  - Total Tasks
  - Idea Tasks
  - To Do Tasks
  - In Progress Tasks
  - In Review Tasks
  - Completed Tasks
- **Sprint Completion Rate**: Visual percentage progress bar.
- **Priority Breakdown Chart**: Distribution across `Critical`, `High`, `Medium`, and `Low`.
- **Overdue Task Alerts**: Real-time detection of overdue tasks with date warnings.
- **Live Activity Feed**: System-wide event stream showing recent task creations, transitions, assignments, and deletions.

### 6. 🎨 Jira Atlassian Design System
- Authentic Atlassian Blue (`#0052CC`) brand styling, modern typography, crisp borders, and clean status pills.
- Fully responsive across desktop, tablet, and mobile with collapsible navigation drawer.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React)                      │
│      Vite + Tailwind CSS + Lucide + @hello-pangea/dnd   │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / Multipart (Port 3000 / 5173)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Reverse Proxy (Nginx)                 │
│         /api/ -> Backend  |  /uploads/ -> Static        │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                   │
│   JWT Auth | Helmet | Multer | Morgan | Rate Limiting   │
└────────────────────────────┬────────────────────────────┘
                             │ Mongoose ODM (TLS / SSL)
                             ▼
┌─────────────────────────────────────────────────────────┐
│               MongoDB Atlas (Cloud Cluster)             │
│        Users | Tasks | Attachments | Activities         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- [npm](https://www.npmjs.com/) (v9.0.0 or later)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

### Step 1: Install Dependencies
From the project root:
```bash
npm run install:all
```
*(Or navigate to `/server` and `/client` individually and run `npm install`)*

---

### Step 2: Configure MongoDB Atlas (Preferred Database)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Security -> Database Access**, create a user (e.g., `admin`).
3. Under **Security -> Network Access**, whitelist your IP address (or `0.0.0.0/0` for access from anywhere).
4. Under **Databases**, click **Connect -> Drivers -> Node.js** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/jira_task_manager?retryWrites=true&w=majority
   ```
5. Create a `.env` file in the `server` directory (or edit `server/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/jira_task_manager?retryWrites=true&w=majority
   JWT_SECRET=production_ultra_secure_jwt_secret_key_jira_pro_2026_xyz!@#
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   MAX_FILE_SIZE_MB=15
   ```

---

### Step 3: Seed Sample Data
Populate realistic users, Jira tasks across all 5 statuses, and status activity histories:
```bash
npm run seed
```

**Pre-Configured Demo Credentials**:
| Role | Name | Email | Password |
|---|---|---|---|
| **Admin / Architect** | Alex Morgan | `alex@example.com` | `Password123!` |
| **Senior Engineer** | Sarah Chen | `sarah@example.com` | `Password123!` |
| **Product Manager** | Michael Scott | `michael@example.com` | `Password123!` |

*(You can also use the one-click demo login buttons directly on the login page!)*

---

### Step 4: Run the Application

In **Terminal 1** (Backend):
```bash
npm run server
# Server runs on http://localhost:5000
```

In **Terminal 2** (Frontend):
```bash
npm run client
# Client opens on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

---

## 🐳 Docker Deployment (Containerization)

The project includes production-ready Dockerfiles for both services and an orchestrated `docker-compose.yml`.

### Architecture:
- **`server/Dockerfile`**: Lightweight `node:20-alpine` image with security healthchecks and persistent uploads volume.
- **`client/Dockerfile`**: Two-stage build: compiles React into static assets with Vite, served via optimized `nginx:alpine` with Gzip and reverse proxy rules.

### Running with Docker Compose:
```bash
# 1. Build and start containers
docker compose up --build -d

# 2. View running logs
docker compose logs -f

# 3. Stop containers
docker compose down
```

Once running:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Healthcheck**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with confirmation | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Private |
| `POST` | `/api/auth/logout` | Revoke session | Private |

### Task Management (`/api/tasks`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports filters: `status`, `priority`, `assignee`, `scope`, `search`) | Private |
| `GET` | `/api/tasks/:id` | Get single task details with attachments and status history | Private |
| `POST` | `/api/tasks` | Create new task (supports multipart file uploads) | Private |
| `PUT` | `/api/tasks/:id` | Update task title, description, assignee, priority, labels | Private (Owner/Assignee/Admin) |
| `PATCH` | `/api/tasks/:id/status` | Fast status transition for Kanban Drag & Drop with audit logging | Private (Authorized) |
| `DELETE` | `/api/tasks/:id` | Permanently delete task & associated files | Private (Creator/Admin) |
| `POST` | `/api/tasks/:id/attachments` | Upload additional files to existing task | Private |
| `DELETE` | `/api/tasks/:id/attachments/:attachmentId` | Remove specific attachment | Private |

### Dashboard & Analytics (`/api/dashboard`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated metrics for all 6 overview cards, overdue items & feed | Private |

### Users (`/api/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/users` | List registered team members for assignment | Private |
| `GET` | `/api/users/:id` | Get user details | Private |

---

## 🔒 Security Measures

1. **Password Hashing**: Bcrypt with auto-generated cryptographic salt.
2. **Helmet Security Headers**: Protection against XSS, clickjacking, and MIME-sniffing.
3. **CORS Whitelisting**: Strict origin validation matching client endpoints.
4. **Rate Limiting**: Brute-force protection on authentication routes.
5. **File Upload Restrictions**: File type validation for dangerous binaries, 15MB size limits, and filename sanitization.
6. **Non-Root Docker Container**: Node.js container runs as restricted `node` user.

---

## 📁 Project Directory Structure

```
├── client/                      # React 18 + Vite Frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Badges, Avatars, Toasts
│   │   │   ├── dashboard/       # Metric cards, charts, activity feed
│   │   │   ├── kanban/          # Drag & Drop Kanban board & columns
│   │   │   ├── layout/          # Navbar & collapsible sidebar
│   │   │   ├── list/            # Full table view of issues
│   │   │   └── modals/          # Create, Detail/Edit, and Delete modals
│   │   ├── context/             # AuthContext & TaskContext
│   │   ├── pages/               # Login & Register views
│   │   ├── services/            # Axios API client & interceptors
│   │   ├── App.jsx              # Main workspace orchestrator
│   │   ├── index.css            # Tailwind directives & styles
│   │   └── main.jsx
│   ├── Dockerfile               # Multi-stage production Nginx Dockerfile
│   ├── nginx.conf               # Nginx reverse proxy configuration
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                      # Node.js Express Backend
│   ├── src/
│   │   ├── config/              # MongoDB Atlas connection
│   │   ├── controllers/         # Auth, Task, Dashboard, User logic
│   │   ├── middleware/          # JWT protect, Multer upload, error handler
│   │   ├── models/              # User, Task, Activity Mongoose schemas
│   │   ├── routes/              # Express API routers
│   │   └── scripts/             # seed.js database seeder
│   ├── uploads/                 # Static storage for task attachments
│   ├── Dockerfile               # Node.js production container
│   ├── package.json
│   └── server.js                # API server entrypoint
│
├── docker-compose.yml           # Production Docker orchestration
├── docker-compose.dev.yml       # Development Docker orchestration
├── .env.example                 # Environment configuration template
└── README.md                    # Comprehensive documentation
```

---

## 📄 License
MIT License. Built for modern agile teams.
