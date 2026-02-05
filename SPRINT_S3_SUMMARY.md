# Sprint S3: AI Journey Generation - Implementation Summary

## Overview
Successfully implemented the AI journey generation feature that allows educators to generate structured learning journeys from text prompts using the seeded resource library.

## Completed Tasks

### 1. Journey Models & Schemas ✅
**Files Created:**
- `backend/models/journey.py` - Journey and JourneyStep models
- `backend/schemas/journey.py` - API request/response schemas

**Key Features:**
- `JourneyModel`: Represents a complete learning journey with metadata
- `JourneyStepModel`: Represents individual steps with resource references
- `GenerateJourneyRequest`: Schema for prompt input
- `JourneyResponse`: Schema for API response with full resource details
- `JourneyStepResponse`: Schema for steps with embedded resource data

### 2. Journey Generation Service ✅
**File Created:** `backend/services/journey_generator.py`

**Implemented Functions:**

#### `analyze_prompt(prompt: str) -> Tuple[str, int, List[str]]`
- Extracts subject from prompt (default: Science)
- Extracts grade level using regex (default: 5)
- Extracts keywords (words > 3 chars, excluding common words)
- Supports: Science, French, English, Math, History

#### `score_resources(resources: List[Resource], keywords: List[str]) -> List[Tuple[Resource, float]]`
- Scoring algorithm:
  - +2 points for keyword in title
  - +1 point for keyword in description
  - +1 point for keyword in tags
  - x1.5 multiplier for cultural_relevance=True
- Returns sorted list by score (descending)

#### `construct_journey(scored_resources, teacher_resources, prompt, subject, grade) -> JourneyModel`
- Builds 4-step journey structure:
  1. **Preparation**: Teacher resource (guide/sequence/thematic_file)
  2. **Hook**: Student resource (video/game)
  3. **Instruction**: Student resource (article/book/video)
  4. **Application**: Student resource (game/worksheet/podcast)
- Ensures no duplicate resources
- Generates unique journey ID: `journey-{timestamp}`
- Creates descriptive title from prompt

### 3. Journey Generation Endpoint ✅
**File Created:** `backend/routers/journeys.py`

**Endpoint:** `POST /api/v1/journeys/generate`

**Features:**
- Requires authentication via JWT token
- Accepts `GenerateJourneyRequest` with prompt
- Steps:
  1. Analyzes prompt to extract subject, grade, keywords
  2. Queries MongoDB for matching resources (subject + grade)
  3. Fetches both student and teacher resources
  4. Scores student resources using keyword matching
  5. Constructs 4-step journey
  6. Returns full journey with embedded resource details
- Error handling:
  - 401: Authentication required
  - 404: Insufficient resources found
  - Validates minimum 3 student resources needed

### 4. Main Integration ✅
**Files Modified:**
- `backend/routers/__init__.py` - Added journeys_router export
- `backend/main.py` - Registered router at `/api/v1/journeys`

### 5. Frontend Integration ✅
**Files Created/Modified:**
- `frontend/lib/journeys.ts` - New API utility for journey generation
- `frontend/app/educator/page.tsx` - Updated to use API endpoint

**Key Changes:**
- Created `generateJourney()` function that:
  - Retrieves auth token from localStorage
  - Calls backend API with prompt
  - Handles authentication errors
  - Converts backend format to frontend format
- Updated educator page:
  - Replaced mock `generateJourneyFromPrompt` with `generateJourney`
  - Added authentication check before generation
  - Shows auth modal if user not logged in
  - Displays error messages for API failures
  - Maintains localStorage compatibility for journey preview

## API Contract

### Request
```json
POST /api/v1/journeys/generate
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "prompt": "Grade 5 Science lesson about plants and photosynthesis"
}
```

### Response
```json
{
  "id": "journey-1738354800000",
  "title": "Learning Journey: Grade 5 Science lesson about plants",
  "grade": 5,
  "subject": "Science",
  "steps": [
    {
      "step_type": "Preparation",
      "resource": {
        "id": "tch-001",
        "title": "Thematic File: Ecosystems & Interactions",
        "description": "A comprehensive guide...",
        "type": "thematic_file",
        "audience": "Teacher",
        "duration": "15 pages",
        "subject": "Science",
        "grade": 5,
        "tags": ["guide", "pedagogy", "ecosystems"],
        "alignment_score": 100,
        "cultural_relevance": false
      }
    },
    {
      "step_type": "Hook",
      "resource": { /* video or game resource */ }
    },
    {
      "step_type": "Instruction",
      "resource": { /* article, book, or video resource */ }
    },
    {
      "step_type": "Application",
      "resource": { /* game, worksheet, or podcast resource */ }
    }
  ],
  "created_at": "2026-01-31T12:00:00Z",
  "class_code": null
}
```

## Testing Instructions

### Backend Testing
1. Start the backend server:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```

2. Test the endpoint using curl or Postman:
   ```bash
   # First, get an auth token by logging in
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "educator@test.com", "password": "password123"}'
   
   # Use the token to generate a journey
   curl -X POST http://localhost:8000/api/v1/journeys/generate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {your_token}" \
     -d '{"prompt": "Grade 5 Science lesson about plants and photosynthesis"}'
   ```

3. Verify the response contains:
   - 4 steps (Preparation, Hook, Instruction, Application)
   - Appropriate resource types for each step
   - Resources matching the subject and grade
   - Higher scores for resources with matching keywords

### Frontend Testing
1. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to `http://localhost:3000/educator`

3. Test the flow:
   - Click "Login" and create an account or sign in
   - Enter a prompt: "Grade 5 Science lesson about plants and photosynthesis"
   - Click "Generate Journey"
   - Verify:
     - Journey is generated successfully
     - Redirects to journey preview page
     - Journey contains 4 steps with appropriate resources
     - Resources are relevant to the prompt

### Expected Results
- **Prompt:** "Grade 5 Science lesson about plants and photosynthesis"
- **Expected Journey:**
  - Subject: Science
  - Grade: 5
  - Step 1 (Preparation): Teacher guide about ecosystems or plants
  - Step 2 (Hook): Video about photosynthesis or plant game
  - Step 3 (Instruction): Article about plant cells or photosynthesis
  - Step 4 (Application): Plant simulation game or worksheet

## Technical Notes

### Resource Scoring Algorithm
The scoring system prioritizes:
1. **Keyword relevance**: Resources with keywords in title/description/tags
2. **Cultural relevance**: 1.5x multiplier for culturally relevant resources
3. **Type appropriateness**: Ensures correct resource types for each step

### Journey Structure
- **Preparation**: Teacher-facing resources to prepare for the lesson
- **Hook**: Engaging content to capture student interest
- **Instruction**: Core learning content
- **Application**: Practice and reinforcement activities

### Authentication Flow
- Journey generation requires authentication
- Frontend checks login status before allowing generation
- Shows auth modal if user not logged in
- Stores auth token in localStorage
- Backend validates JWT token on each request

## Files Created/Modified

### Backend
- ✅ `backend/models/journey.py` (new)
- ✅ `backend/schemas/journey.py` (new)
- ✅ `backend/services/journey_generator.py` (new)
- ✅ `backend/routers/journeys.py` (new)
- ✅ `backend/routers/__init__.py` (modified)
- ✅ `backend/main.py` (modified)

### Frontend
- ✅ `frontend/lib/journeys.ts` (new)
- ✅ `frontend/app/educator/page.tsx` (modified)

## Next Steps (Future Sprints)
1. **Sprint S4**: Journey persistence (save to database)
2. **Sprint S5**: Journey sharing (generate class codes)
3. **Sprint S6**: Student journey access
4. **Sprint S7**: Journey analytics and tracking

## Success Criteria ✅
- [x] Journey models and schemas created
- [x] Prompt analysis extracts subject, grade, keywords
- [x] Resource scoring algorithm implemented
- [x] Journey construction creates 4-step structure
- [x] API endpoint accepts prompts and returns journeys
- [x] Frontend integrated with backend API
- [x] Authentication required for journey generation
- [x] Error handling for insufficient resources
- [x] Journey format compatible with frontend preview

## Conclusion
Sprint S3 has been successfully completed. The AI journey generation feature is now fully functional, allowing educators to generate structured learning journeys from text prompts using the seeded resource library. The system intelligently selects and scores resources based on keyword matching and cultural relevance, creating a 4-step learning journey that follows pedagogical best practices.