# Backend Development Plan for IDÉLLIA Learning Journey Platform

## 1️⃣ Executive Summary

**What will be built:**
- FastAPI backend (Python 3.13, async) for IDÉLLIA learning journey platform
- MongoDB Atlas database for storing journeys, resources, and class codes
- RESTful API endpoints at `/api/v1/*` to support educator and student workflows
- AI-powered journey generation from educator prompts
- Resource library management with curriculum alignment scoring
- Class code-based journey deployment and student access

**Key Constraints:**
- FastAPI with Python 3.13 (async operations)
- MongoDB Atlas only (no local instance)
- Motor driver with Pydantic v2 models
- No Docker deployment
- Manual testing after every task via frontend UI
- Single Git branch (`main`) workflow
- Background tasks synchronous by default (use `BackgroundTasks` only if necessary)

**Sprint Structure:**
- **S0:** Environment setup and frontend connection
- **S1:** Basic authentication (educator signup/login/logout)
- **S2:** Resource library and search
- **S3:** AI journey generation
- **S4:** Journey management (save, retrieve, update)
- **S5:** Class deployment and student access

---

## 2️⃣ In-Scope & Success Criteria

**In-Scope Features:**
- Educator authentication (signup, login, logout)
- Resource library with 15,000+ certified resources
- AI-powered journey generation from text prompts
- Journey CRUD operations (create, read, update)
- Resource swapping within journeys
- Class code generation and deployment
- Student journey access via class code
- Curriculum alignment scoring
- Cultural relevance filtering
- Journey step progression tracking

**Success Criteria:**
- All frontend features functional end-to-end
- Educators can generate and deploy journeys
- Students can access journeys via class codes
- Resource swapping works seamlessly
- All task-level manual tests pass via UI
- Each sprint's code pushed to `main` after verification
- MongoDB Atlas connection stable and performant

---

## 3️⃣ API Design

**Base Path:** `/api/v1`

**Error Envelope:**
```json
{ "error": "descriptive error message" }
```

### Health Check
- **GET** `/healthz`
- **Purpose:** Verify backend and database connectivity
- **Response:** `{ "status": "ok", "database": "connected", "timestamp": "ISO8601" }`

### Authentication Endpoints

- **POST** `/api/v1/auth/signup`
  - **Purpose:** Register new educator account
  - **Request:** `{ "email": "string", "password": "string", "name": "string" }`
  - **Response:** `{ "id": "string", "email": "string", "name": "string", "token": "JWT" }`
  - **Validation:** Email format, password min 8 chars, unique email

- **POST** `/api/v1/auth/login`
  - **Purpose:** Authenticate educator and issue JWT
  - **Request:** `{ "email": "string", "password": "string" }`
  - **Response:** `{ "id": "string", "email": "string", "name": "string", "token": "JWT" }`
  - **Validation:** Credentials match, account exists

- **POST** `/api/v1/auth/logout`
  - **Purpose:** Invalidate session (client-side token removal)
  - **Request:** Headers with `Authorization: Bearer <token>`
  - **Response:** `{ "message": "Logged out successfully" }`

- **GET** `/api/v1/auth/me`
  - **Purpose:** Get current educator profile
  - **Request:** Headers with `Authorization: Bearer <token>`
  - **Response:** `{ "id": "string", "email": "string", "name": "string" }`

### Resource Endpoints

- **GET** `/api/v1/resources`
  - **Purpose:** List all resources with optional filtering
  - **Query Params:** `subject`, `grade`, `type`, `audience`, `culturalRelevance`
  - **Response:** `{ "resources": [Resource], "total": number }`
  - **Validation:** Valid enum values for filters

- **GET** `/api/v1/resources/{id}`
  - **Purpose:** Get single resource details
  - **Response:** `Resource` object
  - **Validation:** Resource exists

- **GET** `/api/v1/resources/search`
  - **Purpose:** Search resources by keywords and filters
  - **Query Params:** `q` (query), `subject`, `grade`, `type`, `culturalRelevance`
  - **Response:** `{ "resources": [Resource], "total": number }`
  - **Validation:** Query string not empty

### Journey Endpoints

- **POST** `/api/v1/journeys/generate`
  - **Purpose:** Generate journey from educator prompt using AI
  - **Request:** `{ "prompt": "string", "educatorId": "string" }`
  - **Response:** `{ "journey": Journey, "draftId": "string" }`
  - **Validation:** Prompt 10-500 chars, authenticated educator

- **POST** `/api/v1/journeys`
  - **Purpose:** Save journey draft
  - **Request:** `Journey` object with steps
  - **Response:** `{ "id": "string", "journey": Journey }`
  - **Validation:** Valid journey structure, authenticated educator

- **GET** `/api/v1/journeys/{id}`
  - **Purpose:** Retrieve journey by ID
  - **Response:** `Journey` object
  - **Validation:** Journey exists, educator owns it

- **PUT** `/api/v1/journeys/{id}`
  - **Purpose:** Update journey (swap resources, modify steps)
  - **Request:** Updated `Journey` object
  - **Response:** `{ "journey": Journey }`
  - **Validation:** Journey exists, educator owns it

- **POST** `/api/v1/journeys/{id}/deploy`
  - **Purpose:** Deploy journey and generate class code
  - **Response:** `{ "classCode": "string", "journey": Journey }`
  - **Validation:** Journey exists, educator owns it, code unique

- **GET** `/api/v1/journeys/code/{code}`
  - **Purpose:** Retrieve journey by class code (student access)
  - **Response:** `Journey` object (filtered for student audience)
  - **Validation:** Code exists, journey deployed

---

## 4️⃣ Data Model (MongoDB Atlas)

### Collection: `educators`
**Fields:**
- `_id`: ObjectId (auto-generated)
- `email`: string (required, unique, indexed)
- `password_hash`: string (required, Argon2 hashed)
- `name`: string (required)
- `created_at`: datetime (required, default now)
- `updated_at`: datetime (required, default now)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "teacher@school.ca",
  "password_hash": "$argon2id$v=19$m=65536...",
  "name": "Jane Doe",
  "created_at": "2026-01-31T18:00:00Z",
  "updated_at": "2026-01-31T18:00:00Z"
}
```

### Collection: `resources`
**Fields:**
- `_id`: ObjectId (auto-generated)
- `title`: string (required)
- `description`: string (required)
- `type`: string (required, enum: video, article, game, book, podcast, worksheet, guide, sequence, thematic_file)
- `audience`: string (required, enum: Student, Teacher)
- `duration`: string (required)
- `subject`: string (required, enum: Science, English, French, Math, History)
- `grade`: int (required, 1-12)
- `tags`: array of strings (default [])
- `thumbnail_url`: string (optional)
- `content_url`: string (optional)
- `alignment_score`: int (optional, 0-100)
- `cultural_relevance`: boolean (default false)
- `created_at`: datetime (required, default now)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "The Magic of Photosynthesis",
  "description": "An animated video explaining how plants convert sunlight into energy.",
  "type": "video",
  "audience": "Student",
  "duration": "4:30",
  "subject": "Science",
  "grade": 5,
  "tags": ["plants", "biology", "energy"],
  "alignment_score": 98,
  "cultural_relevance": false,
  "created_at": "2026-01-31T18:00:00Z"
}
```

### Collection: `journeys`
**Fields:**
- `_id`: ObjectId (auto-generated)
- `educator_id`: ObjectId (required, references educators)
- `title`: string (required)
- `grade`: int (required)
- `subject`: string (required)
- `steps`: array of embedded documents (required)
  - `step_type`: string (enum: Preparation, Hook, Instruction, Application)
  - `resource_id`: ObjectId (references resources)
- `class_code`: string (optional, unique, 6 chars uppercase, indexed)
- `deployed`: boolean (default false)
- `created_at`: datetime (required, default now)
- `updated_at`: datetime (required, default now)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "educator_id": "507f1f77bcf86cd799439011",
  "title": "Grade 5 Science: Photosynthesis & Plant Life",
  "grade": 5,
  "subject": "Science",
  "steps": [
    {
      "step_type": "Preparation",
      "resource_id": "507f1f77bcf86cd799439014"
    },
    {
      "step_type": "Hook",
      "resource_id": "507f1f77bcf86cd799439012"
    }
  ],
  "class_code": "ABC123",
  "deployed": true,
  "created_at": "2026-01-31T18:00:00Z",
  "updated_at": "2026-01-31T18:00:00Z"
}
```

---

## 5️⃣ Frontend Audit & Feature Map

### Landing Page (`/`)
- **Route:** [`frontend/app/page.tsx`](frontend/app/page.tsx:1)
- **Purpose:** Role selection (Educator vs Student)
- **Data Needed:** None (static content)
- **Backend Endpoints:** None
- **Auth Required:** No

### Educator Builder (`/educator`)
- **Route:** [`frontend/app/educator/page.tsx`](frontend/app/educator/page.tsx:1)
- **Purpose:** Journey generation from prompt
- **Data Needed:** Educator profile, AI generation
- **Backend Endpoints:** 
  - `POST /api/v1/journeys/generate`
- **Auth Required:** Yes (JWT)

### Journey Preview (`/educator/journey/[id]`)
- **Route:** [`frontend/app/educator/journey/[id]/page.tsx`](frontend/app/educator/journey/[id]/page.tsx:1)
- **Purpose:** Review, edit, swap resources, deploy journey
- **Data Needed:** Journey details, resource library for swapping
- **Backend Endpoints:**
  - `GET /api/v1/journeys/{id}`
  - `PUT /api/v1/journeys/{id}`
  - `POST /api/v1/journeys/{id}/deploy`
  - `GET /api/v1/resources` (filtered by subject)
- **Auth Required:** Yes (JWT)

### Student Login (`/student`)
- **Route:** [`frontend/app/student/page.tsx`](frontend/app/student/page.tsx:1)
- **Purpose:** Enter class code to access journey
- **Data Needed:** Journey validation by code
- **Backend Endpoints:**
  - `GET /api/v1/journeys/code/{code}`
- **Auth Required:** No (anonymous access)

### Student Player (`/student/journey/[code]`)
- **Route:** [`frontend/app/student/journey/[code]/page.tsx`](frontend/app/student/journey/[code]/page.tsx:1)
- **Purpose:** Step-by-step journey playback
- **Data Needed:** Journey with student-only resources
- **Backend Endpoints:**
  - `GET /api/v1/journeys/code/{code}`
- **Auth Required:** No (anonymous access)

---

## 6️⃣ Configuration & ENV Vars

**Required Environment Variables:**
- `APP_ENV` — Environment (development, production)
- `PORT` — HTTP port (default: 8000)
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Token signing key (min 32 chars)
- `JWT_EXPIRES_IN` — JWT expiry in seconds (default: 86400 = 24h)
- `CORS_ORIGINS` — Comma-separated allowed frontend URLs

**Example `.env` file:**
```
APP_ENV=development
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/idellia?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRES_IN=86400
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 7️⃣ Background Work

**AI Journey Generation:**
- **Trigger:** Educator submits prompt via `POST /api/v1/journeys/generate`
- **Purpose:** Analyze prompt, search resources, score relevance, construct journey
- **Implementation:** Synchronous processing (acceptable for <2 min generation time)
- **Idempotency:** Each request generates new journey with unique ID
- **UI Feedback:** Loading state with "Crafting Journey..." message

**No background tasks required** — all operations complete within request lifecycle.

---

## 8️⃣ Integrations

**No external integrations required** for MVP. All resources are pre-loaded in MongoDB Atlas.

**Future considerations (out of scope):**
- IDÉLLO API integration for real-time resource sync
- Email notifications for journey deployment
- Analytics tracking for student progress

---

## 9️⃣ Testing Strategy (Manual via Frontend)

**Testing Approach:**
- Every task includes **Manual Test Step** (exact UI action + expected result)
- Every task includes **User Test Prompt** (copy-paste instruction)
- Test after each task completion before proceeding
- After all sprint tasks pass → commit and push to `main`
- If any test fails → fix immediately and retest

**Test Environment:**
- Backend running locally on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- MongoDB Atlas connection active

---

## 🔟 Dynamic Sprint Plan & Backlog

---

## 🧱 S0 – Environment Setup & Frontend Connection

**Objectives:**
- Create FastAPI skeleton with `/api/v1` base path and `/healthz` endpoint
- Connect to MongoDB Atlas using `MONGODB_URI`
- `/healthz` performs DB ping and returns JSON status
- Enable CORS for frontend origin
- Replace dummy API URLs in frontend with real backend URLs
- Initialize Git repository at root with `main` as default branch
- Create single `.gitignore` file at root
- Push initial commit to GitHub

**User Stories:**
- As a developer, I need a working FastAPI server so I can build endpoints
- As a developer, I need MongoDB Atlas connection so I can store data
- As a developer, I need CORS enabled so frontend can communicate with backend

**Tasks:**

1. **Create FastAPI project structure**
   - Create `backend/` directory at project root
   - Create `backend/main.py` with FastAPI app instance
   - Create `backend/requirements.txt` with dependencies: `fastapi`, `uvicorn[standard]`, `motor`, `pydantic`, `pydantic-settings`, `python-dotenv`, `argon2-cffi`, `pyjwt`
   - Create `backend/.env.example` with all required env vars
   - Create `backend/config.py` for settings management using Pydantic BaseSettings
   - **Manual Test Step:** Run `pip install -r requirements.txt` → all packages install successfully
   - **User Test Prompt:** "Install backend dependencies and confirm no errors."

2. **Implement `/healthz` endpoint with MongoDB ping**
   - Create `backend/database.py` with Motor async client initialization
   - Implement connection test function that pings MongoDB Atlas
   - Add `/healthz` GET endpoint in `main.py` that returns `{ "status": "ok", "database": "connected", "timestamp": "ISO8601" }`
   - **Manual Test Step:** Start backend with `uvicorn backend.main:app --reload` → visit `http://localhost:8000/healthz` → see `200 OK` with DB status
   - **User Test Prompt:** "Start the backend and navigate to /healthz. Confirm you see database connection status."

3. **Configure CORS for frontend**
   - Add `fastapi.middleware.cors.CORSMiddleware` to app
   - Read `CORS_ORIGINS` from env and split by comma
   - Allow credentials, all methods, all headers
   - **Manual Test Step:** Open frontend dev tools → Network tab → make request to `/healthz` → no CORS errors
   - **User Test Prompt:** "Open frontend and check browser console. Confirm no CORS errors when calling backend."

4. **Initialize Git repository and push to GitHub**
   - Run `git init` at project root (if not already initialized)
   - Set default branch to `main`: `git branch -M main`
   - Create `.gitignore` at root with: `__pycache__/`, `.env`, `*.pyc`, `.venv/`, `venv/`, `node_modules/`, `.next/`
   - Add all files: `git add .`
   - Commit: `git commit -m "Initial backend setup with FastAPI and MongoDB Atlas"`
   - Create GitHub repo and push: `git remote add origin <url>` then `git push -u origin main`
   - **Manual Test Step:** Visit GitHub repo → see initial commit with backend files
   - **User Test Prompt:** "Check GitHub repository and confirm initial backend code is pushed to main branch."

5. **Update frontend to use real backend URLs**
   - Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
   - Update [`frontend/lib/mockData.ts`](frontend/lib/mockData.ts:1) to use real API calls instead of mock data (keep mock data as fallback for now)
   - **Manual Test Step:** Frontend makes request to `/healthz` → receives real response
   - **User Test Prompt:** "Refresh the frontend app and verify it connects to the backend healthcheck endpoint."

**Definition of Done:**
- Backend runs locally on port 8000
- `/healthz` returns 200 OK with MongoDB connection status
- Frontend can call backend without CORS errors
- Git repository initialized with `main` branch
- Initial commit pushed to GitHub
- `.gitignore` properly excludes sensitive files

---

## 🧩 S1 – Basic Auth (Signup / Login / Logout)

**Objectives:**
- Implement JWT-based educator authentication
- Store educators in MongoDB with hashed passwords (Argon2)
- Protect educator routes with JWT middleware
- Enable educator signup, login, and logout flows

**User Stories:**
- As an educator, I can create an account so I can build journeys
- As an educator, I can log in to access my journeys
- As an educator, I can log out to end my session

**Endpoints:**
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

**Tasks:**

1. **Create Educator Pydantic model and MongoDB schema**
   - Create `backend/models/educator.py` with Pydantic model for Educator
   - Fields: `id`, `email`, `password_hash`, `name`, `created_at`, `updated_at`
   - Create `backend/schemas/educator.py` with request/response schemas
   - **Manual Test Step:** Import models in Python shell → no errors
   - **User Test Prompt:** "Verify educator models are properly defined without import errors."

2. **Implement password hashing with Argon2**
   - Create `backend/utils/security.py` with `hash_password()` and `verify_password()` functions using `argon2-cffi`
   - **Manual Test Step:** Test in Python shell → hash password → verify returns True for correct password
   - **User Test Prompt:** "Test password hashing functions in Python shell and confirm they work correctly."

3. **Implement JWT token generation and validation**
   - Add JWT functions to `backend/utils/security.py`: `create_access_token()` and `decode_access_token()`
   - Use `JWT_SECRET` and `JWT_EXPIRES_IN` from config
   - **Manual Test Step:** Generate token → decode token → payload matches
   - **User Test Prompt:** "Test JWT token creation and decoding in Python shell."

4. **Implement `POST /api/v1/auth/signup` endpoint**
   - Create `backend/routers/auth.py` with signup endpoint
   - Validate email format and password length (min 8 chars)
   - Check if email already exists in database
   - Hash password with Argon2
   - Insert educator into `educators` collection
   - Return educator data with JWT token
   - **Manual Test Step:** Use frontend signup form → enter email/password → see success message and redirect
   - **User Test Prompt:** "Create a new educator account via the frontend signup form and confirm you're logged in."

5. **Implement `POST /api/v1/auth/login` endpoint**
   - Validate credentials against database
   - Verify password hash matches
   - Generate JWT token
   - Return educator data with token
   - **Manual Test Step:** Use frontend login form → enter credentials → see success and redirect to dashboard
   - **User Test Prompt:** "Log in with your educator account and confirm you're redirected to the educator dashboard."

6. **Implement JWT authentication dependency**
   - Create `backend/dependencies/auth.py` with `get_current_educator()` dependency
   - Extract token from `Authorization: Bearer <token>` header
   - Decode and validate token
   - Fetch educator from database
   - Raise 401 if invalid
   - **Manual Test Step:** Call protected endpoint without token → 401 error
   - **User Test Prompt:** "Try accessing a protected route without logging in and confirm you get an authentication error."

7. **Implement `GET /api/v1/auth/me` endpoint**
   - Protect with `get_current_educator` dependency
   - Return current educator profile
   - **Manual Test Step:** Log in → call `/api/v1/auth/me` → see educator profile
   - **User Test Prompt:** "After logging in, verify your profile loads correctly in the educator dashboard."

8. **Implement `POST /api/v1/auth/logout` endpoint**
   - Accept token in header
   - Return success message (client handles token removal)
   - **Manual Test Step:** Click logout button → token cleared → redirected to login
   - **User Test Prompt:** "Log out and confirm you're redirected to the login page and can't access protected routes."

9. **Update frontend to use real auth endpoints**
   - Update [`frontend/app/educator/page.tsx`](frontend/app/educator/page.tsx:1) to call real signup/login APIs
   - Store JWT token in localStorage
   - Add token to all authenticated requests
   - **Manual Test Step:** Complete full auth flow → signup → login → logout → works end-to-end
   - **User Test Prompt:** "Test the complete authentication flow: signup, login, access protected page, logout."

**Definition of Done:**
- Educators can signup with email/password
- Passwords hashed with Argon2
- Login returns valid JWT token
- Protected routes require valid JWT
- Logout clears session
- Frontend auth flow works end-to-end

---

## 🧩 S2 – Resource Library and Search

**Objectives:**
- Seed MongoDB with 15,000+ certified resources
- Implement resource listing with filtering
- Implement resource search by keywords
- Enable resource retrieval by ID

**User Stories:**
- As an educator, I can browse the resource library
- As an educator, I can filter resources by subject, grade, type
- As an educator, I can search resources by keywords
- As the system, I can retrieve resources for journey generation

**Endpoints:**
- `GET /api/v1/resources`
- `GET /api/v1/resources/{id}`
- `GET /api/v1/resources/search`

**Tasks:**

1. **Create Resource Pydantic model**
   - Create `backend/models/resource.py` with Resource model
   - Fields match [`frontend/lib/mockData.ts`](frontend/lib/mockData.ts:5) Resource interface
   - **Manual Test Step:** Import model → no errors
   - **User Test Prompt:** "Verify resource model is properly defined."

2. **Create resource seed script**
   - Create `backend/scripts/seed_resources.py`
   - Convert mock data from [`frontend/lib/mockData.ts`](frontend/lib/mockData.ts:37) to Python
   - Expand to 100+ resources covering all subjects/grades (simulate 15,000+ library)
   - Insert into `resources` collection
   - **Manual Test Step:** Run seed script → check MongoDB Atlas → resources inserted
   - **User Test Prompt:** "Run the seed script and verify resources appear in MongoDB Atlas."

3. **Implement `GET /api/v1/resources` endpoint**
   - Create `backend/routers/resources.py`
   - Support query params: `subject`, `grade`, `type`, `audience`, `culturalRelevance`
   - Return paginated results (default 50 per page)
   - **Manual Test Step:** Call endpoint with filters → correct resources returned
   - **User Test Prompt:** "Test resource filtering via API and confirm results match filters."

4. **Implement `GET /api/v1/resources/{id}` endpoint**
   - Fetch single resource by ObjectId
   - Return 404 if not found
   - **Manual Test Step:** Call with valid ID → resource returned; invalid ID → 404
   - **User Test Prompt:** "Retrieve a specific resource by ID and confirm details are correct."

5. **Implement `GET /api/v1/resources/search` endpoint**
   - Accept `q` query param for keyword search
   - Search in `title`, `description`, `tags` fields using MongoDB text search or regex
   - Support additional filters (subject, grade, etc.)
   - Return scored results (relevance)
   - **Manual Test Step:** Search for "photosynthesis" → relevant resources returned
   - **User Test Prompt:** "Search for a keyword and verify relevant resources appear in results."

6. **Update frontend to use real resource endpoints**
   - Update resource swapping modal in [`frontend/app/educator/journey/[id]/page.tsx`](frontend/app/educator/journey/[id]/page.tsx:400) to fetch from API
   - **Manual Test Step:** Open swap modal → see real resources from database
   - **User Test Prompt:** "Open the resource swap modal and confirm resources load from the backend."

**Definition of Done:**
- Resources seeded in MongoDB Atlas
- Resource listing works with filters
- Resource search returns relevant results
- Resource retrieval by ID works
- Frontend displays real resources

---

## 🧩 S3 – AI Journey Generation

**Objectives:**
- Implement AI-powered journey generation from educator prompts
- Analyze prompt to determine subject, grade, keywords
- Search and score resources for relevance
- Construct journey with Preparation, Hook, Instruction, Application steps
- Return generated journey to frontend

**User Stories:**
- As an educator, I can enter a lesson prompt and get a structured journey
- As the system, I can analyze prompts and select relevant resources
- As the system, I can prioritize culturally relevant resources

**Endpoints:**
- `POST /api/v1/journeys/generate`

**Tasks:**

1. **Create Journey Pydantic models**
   - Create `backend/models/journey.py` with Journey and JourneyStep models
   - Match [`frontend/lib/mockData.ts`](frontend/lib/mockData.ts:26) LearningJourney interface
   - **Manual Test Step:** Import models → no errors
   - **User Test Prompt:** "Verify journey models are properly defined."

2. **Implement prompt analysis logic**
   - Create `backend/services/journey_generator.py`
   - Implement `analyze_prompt()` function to extract:
     - Subject (Science, English, French, Math, History)
     - Grade level (1-12)
     - Keywords for resource matching
   - Use simple keyword matching (no external AI API needed for MVP)
   - **Manual Test Step:** Test with sample prompts → correct subject/grade extracted
   - **User Test Prompt:** "Test prompt analysis with various inputs and verify correct subject/grade detection."

3. **Implement resource scoring algorithm**
   - Implement `score_resources()` function
   - Score based on:
     - Keyword matches in title (weight: 2)
     - Keyword matches in description (weight: 1)
     - Keyword matches in tags (weight: 1)
     - Cultural relevance boost (multiply by 1.5)
     - Curriculum alignment score
   - **Manual Test Step:** Score resources for "photosynthesis" → relevant resources ranked higher
   - **User Test Prompt:** "Test resource scoring and verify relevant resources rank higher."

4. **Implement journey construction logic**
   - Implement `construct_journey()` function
   - Select resources for each step type:
     - **Preparation:** Teacher resource (guide, sequence, thematic_file)
     - **Hook:** Engaging student resource (video, game)
     - **Instruction:** Informative student resource (article, book, video)
     - **Application:** Interactive student resource (game, worksheet, podcast)
   - Ensure no duplicate resources
   - **Manual Test Step:** Construct journey → 4 steps with appropriate resource types
   - **User Test Prompt:** "Generate a journey and verify it has 4 distinct steps with appropriate resource types."

5. **Implement `POST /api/v1/journeys/generate` endpoint**
   - Create `backend/routers/journeys.py`
   - Protect with `get_current_educator` dependency
   - Accept prompt in request body
   - Call journey generation service
   - Return generated journey with draft ID
   - **Manual Test Step:** Submit prompt via frontend → journey generated and displayed
   - **User Test Prompt:** "Enter a lesson prompt in the educator builder and confirm a journey is generated."

6. **Update frontend to use real generation endpoint**
   - Update [`frontend/app/educator/page.tsx`](frontend/app/educator/page.tsx:14) to call `POST /api/v1/journeys/generate`
   - Display loading state during generation
   - Navigate to journey preview on success
   - **Manual Test Step:** Full flow → enter prompt → see loading → journey preview loads
   - **User Test Prompt:** "Generate a journey from the educator builder and verify it displays correctly in the preview."

**Definition of Done:**
- Prompt analysis extracts subject and grade
- Resources scored by relevance
- Journey constructed with 4 appropriate steps
- Generation endpoint returns valid journey
- Frontend displays generated journey

---

## 🧩 S4 – Journey Management (Save, Retrieve, Update)

**Objectives:**
- Save journey drafts to MongoDB
- Retrieve journeys by ID
- Update journeys (swap resources, modify steps)
- Associate journeys with educators

**User Stories:**
- As an educator, I can save my journey drafts
- As an educator, I can retrieve my saved journeys
- As an educator, I can swap resources in my journey
- As an educator, I can update journey details

**Endpoints:**
- `POST /api/v1/journeys`
- `GET /api/v1/journeys/{id}`
- `PUT /api/v1/journeys/{id}`

**Tasks:**

1. **Implement `POST /api/v1/journeys` endpoint**
   - Accept journey object in request body
   - Validate journey structure
   - Associate with current educator
   - Insert into `journeys` collection
   - Return journey with ID
   - **Manual Test Step:** Save journey from frontend → journey stored in database
   - **User Test Prompt:** "Generate a journey and verify it's saved to the database."

2. **Implement `GET /api/v1/journeys/{id}` endpoint**
   - Fetch journey by ObjectId
   - Verify educator owns journey
   - Populate resource details for each step
   - Return 404 if not found or unauthorized
   - **Manual Test Step:** Navigate to journey preview → journey loads with all resources
   - **User Test Prompt:** "Open a saved journey and confirm all details load correctly."

3. **Implement `PUT /api/v1/journeys/{id}` endpoint**
   - Accept updated journey object
   - Update fields in database (title, steps, modified date)
   - Ensure educator owns journey
   - **Manual Test Step:** Swap resource in frontend → persist change (refresh page)
   - **User Test Prompt:** "Swap a resource in the journey preview, refresh the page, and confirm the change persists."

4. **Update frontend to use journey management endpoints**
   - Update [`frontend/app/educator/journey/[id]/page.tsx`](frontend/app/educator/journey/[id]/page.tsx:105) to call API on resource swap
   - **Manual Test Step:** Full flow → generate → swap → refresh → verify
   - **User Test Prompt:** "Test the entire journey editing flow: generate, save, and edit a journey."

**Definition of Done:**
- Journeys persist in MongoDB
- Educators can only access their own journeys
- Updates (resource swaps) are saved correctly
- Frontend connects to all CRUD endpoints

---

## 🧩 S5 – Class Deployment & Student Access

**Objectives:**
- Implement journey deployment with unique class codes
- Enable student access via class code
- Filter student view (hide teacher resources)
- Track student progress (client-side only for MVP)

**User Stories:**
- As an educator, I can deploy a journey and get a code
- As a student, I can join a class with a code
- As a student, I only see student-appropriate resources

**Endpoints:**
- `POST /api/v1/journeys/{id}/deploy`
- `GET /api/v1/journeys/code/{code}`

**Tasks:**

1. **Implement `POST /api/v1/journeys/{id}/deploy` endpoint**
   - Generate unique 6-character alphanumeric code (uppercase)
   - Check collision in database
   - Update journey with `class_code` and `deployed=True`
   - Return code to frontend
   - **Manual Test Step:** Click deploy button → receive 6-char code
   - **User Test Prompt:** "Deploy a journey and verify you receive a 6-character class code."

2. **Implement `GET /api/v1/journeys/code/{code}` endpoint**
   - Find journey by class code
   - Filter out steps where `resource.audience == 'Teacher'`
   - Return filtered journey to student
   - **Manual Test Step:** Call with code → receive journey with only student resources
   - **User Test Prompt:** "Use the class code to fetch the journey and confirm teacher resources are hidden."

3. **Update frontend deploy modal**
   - Update [`frontend/app/educator/journey/[id]/page.tsx`](frontend/app/educator/journey/[id]/page.tsx:93) to call deploy API
   - Display returned code
   - **Manual Test Step:** Click Deploy → see code → copy code
   - **User Test Prompt:** "Click the deploy button and confirm the class code is displayed."

4. **Update student login page**
   - Update [`frontend/app/student/page.tsx`](frontend/app/student/page.tsx:15) to validate code via API
   - Redirect to player on success
   - **Manual Test Step:** Enter valid code → redirect to player; invalid code → show error
   - **User Test Prompt:** "Enter a valid class code and confirm you are redirected to the student player."

5. **Update student player**
   - Update [`frontend/app/student/journey/[code]/page.tsx`](frontend/app/student/journey/[code]/page.tsx:18) to fetch journey via API
   - Render steps
   - **Manual Test Step:** Walk through journey → all resources load
   - **User Test Prompt:** "Complete the full student journey and verify all steps load correctly."

**Definition of Done:**
- Journeys can be deployed
- Unique class codes generated
- Students can access journeys anonymously
- Teacher resources hidden from students
- End-to-end flow: Generate → Deploy → Student Join → Play

---

## ✅ STYLE & COMPLIANCE CHECKS
- [x] Bullets only — no tables or prose
- [x] Mention only visible frontend features
- [x] Minimal APIs/models aligned with UI
- [x] MongoDB Atlas only
- [x] Python 3.13 runtime
- [x] Each task has test step
- [x] After all tests → **commit & push to main**
