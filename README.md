# MediTrack — Unified Healthcare Record System
### Hackathon Project | Spring Boot 3 + React + Spring AI + MySQL

---

## 🚀 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Spring Boot 3, Spring Security, JWT     |
| Database  | MySQL (Railway)                         |
| AI        | Spring AI + OpenAI GPT-4o-mini          |
| Frontend  | React 18, Vite, Tailwind CSS            |
| Auth      | JWT Bearer Token                        |
| QR Code   | qrcode.react                            |

---

## ⚙️ Local Development

### 1. Backend Setup
```bash
cd backend
# Edit src/main/resources/application.properties:
#   Set spring.datasource.password
#   Set spring.ai.openai.api-key
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# .env already set to http://localhost:8080
npm run dev
# Opens http://localhost:5173
```

---

## 🔐 Roles & Demo Credentials

| Role    | Demo Email           | Dashboard URL |
|---------|----------------------|---------------|
| PATIENT | patient@test.com     | /patient      |
| DOCTOR  | doctor@test.com      | /doctor       |
| ADMIN   | admin@test.com       | /admin        |

**Password:** `test123`

---

## 🌐 API Endpoints

| Method | Endpoint                          | Auth    | Description              |
|--------|-----------------------------------|---------|--------------------------|
| POST   | /api/auth/register                | Public  | Register                 |
| POST   | /api/auth/login                   | Public  | Login → JWT              |
| GET    | /api/auth/me                      | JWT     | Current user info        |
| GET    | /api/patient/profile              | PATIENT | Get profile              |
| PUT    | /api/patient/profile              | PATIENT | Update profile           |
| GET    | /api/patient/records              | PATIENT | Get records              |
| POST   | /api/patient/records/upload       | PATIENT | Upload record            |
| GET    | /api/doctor/patients              | DOCTOR  | All patients             |
| GET    | /api/doctor/patients/search?name= | DOCTOR  | Search patients          |
| GET    | /api/doctor/patients/:id/records  | DOCTOR  | Patient records          |
| PUT    | /api/doctor/records/:id/notes     | DOCTOR  | Add doctor note          |
| GET    | /api/emergency/view/:qrToken      | Public  | Emergency QR data        |
| POST   | /api/ai/symptoms                  | JWT     | AI symptom analysis      |
| POST   | /api/ai/summarize                 | JWT     | AI report summarizer     |
| GET    | /api/admin/stats                  | ADMIN   | System stats             |
| GET    | /api/admin/users                  | ADMIN   | All users                |
| PUT    | /api/admin/users/:id/toggle       | ADMIN   | Enable/disable user      |
| DELETE | /api/admin/users/:id              | ADMIN   | Delete user              |

---

## 🚢 Deployment (GitHub → Railway + Vercel)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — MediTrack hackathon project"
git remote add origin https://github.com/YOUR_USERNAME/meditrack.git
git branch -M main
git push -u origin main
```

### Step 2 — Database (Railway)
1. Go to [railway.app](https://railway.app) → New Project → **Add MySQL**
2. Copy env vars: `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`

### Step 3 — Backend (Railway or Render)

**Option A: Railway**
1. New Project → **Deploy from GitHub** → select your repo → set root path to `backend`
2. Add env vars in Railway dashboard:
   ```
   MYSQLHOST=...         (from MySQL plugin)
   MYSQLPORT=3306
   MYSQLDATABASE=...
   MYSQLUSER=...
   MYSQLPASSWORD=...
   JWT_SECRET=your_random_64_char_string
   OPENAI_API_KEY=sk-...
   FRONTEND_URL=https://your-app.vercel.app
   ```

**Option B: Render**
1. New Web Service → Connect GitHub → root dir = `backend`
2. Build Command: `mvn clean package -DskipTests`
3. Start Command: `java -jar target/*.jar`
4. Add same env vars as above

### Step 4 — Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Set **Root Directory** = `frontend`
3. Add env var:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
4. Deploy!

### Step 5 — CORS Fix
After Vercel gives you a URL, update your backend env var:
```
FRONTEND_URL=https://your-app.vercel.app
```
And redeploy the backend.

---

## 🏗️ Project Structure

```
meditrack/
├── backend/                        (Spring Boot — Railway/Render)
│   └── src/main/java/com/meditrack/
│       ├── entity/                 User, Patient, Doctor, MedicalRecord, EmergencyCard
│       ├── repository/             JPA repositories
│       ├── dto/                    Request/Response DTOs
│       ├── security/               JWT (JwtUtil, JwtAuthFilter, SecurityConfig)
│       ├── service/                Business logic
│       ├── controller/             REST APIs
│       ├── ai/                     Spring AI — Symptom Analyzer, Report Summarizer
│       └── exception/              Global error handler
│
└── frontend/                       (React + Vite + Tailwind — Vercel)
    └── src/
        ├── context/AuthContext      Login state, JWT storage
        ├── routes/                  RoleRoute, ProtectedRoute
        ├── pages/                   Login, Register, PatientDashboard,
        │                            DoctorDashboard, AdminDashboard,
        │                            EmergencyPage, UploadRecord
        ├── components/              Navbar, RecordCard, HealthTimeline,
        │                            QRCard, StatsCard, LoadingSpinner
        └── components/ai/           SymptomChecker, ReportSummaryCard
```

---

## ✅ Features

| Feature                     | Status |
|-----------------------------|--------|
| JWT Authentication          | ✅     |
| Role-based Access Control   | ✅     |
| Patient Dashboard           | ✅     |
| Edit Profile                | ✅     |
| Medical Records Upload      | ✅     |
| Drag & Drop File Upload     | ✅     |
| Health Timeline             | ✅     |
| Emergency QR Code           | ✅     |
| Doctor Dashboard            | ✅     |
| Patient Search              | ✅     |
| Doctor Notes on Records     | ✅     |
| Admin User Management       | ✅     |
| AI Symptom Checker          | ✅     |
| AI Report Summarizer        | ✅     |
| Fully Responsive (Mobile)   | ✅     |

---

*Built with ❤️ for NareshIT Hackathon*
