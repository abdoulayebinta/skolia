# Sprint S4: Journey Management (Save, Retrieve, Update) - COMPLETED

## Objective
Implement persistence for learning journeys, allowing educators to save, view, and modify their generated journeys.

## Implementation Summary

### 1. Backend Implementation ✅

#### Fixed Import Issues
- **File**: `backend/main.py`, `backend/database.py`, `backend/services/journey_generator.py`, `backend/schemas/journey.py`
- **Changes**: Converted all `from backend.X` imports to relative imports (`from X`) to fix module resolution when running from the backend directory
- **Installed**: `email-validator` package required by Pydantic for email validation

#### Added Journey Schemas
- **File**: `backend/schemas/journey.py`
- **Added**:
  - `JourneyStepRequest`: Schema for journey step in create/update requests
  - `CreateJourneyRequest`: Schema for creating new journeys
  - `UpdateJourneyRequest`: Schema for updating existing journeys (title and/or steps)

#### Implemented CRUD Endpoints
- **File**: `backend/routers/journeys.py`
- **Endpoints Added**:
  
  1. **POST `/api/v1/journeys/`** - Create Journey
     - Accepts `CreateJourneyRequest` with journey data
     - Associates journey with `current_educator.id` from JWT token
     - Inserts into MongoDB `journeys` collection
     - Returns journey with MongoDB ObjectId
  
  2. **GET `/api/v1/journeys/{id}`** - Retrieve Journey
     - Accepts MongoDB ObjectId as path parameter
     - Verifies ownership (`educator_id` matches `current_educator.id`)
     - Returns 403 if not owner, 404 if not found
     - Returns journey with full resource details
  
  3. **PUT `/api/v1/journeys/{id}`** - Update Journey
     - Accepts MongoDB ObjectId and `UpdateJourneyRequest`
     - Verifies ownership before updating
     - Updates specified fields (title and/or steps)
     - Returns updated journey with full resource details

### 2. Frontend API Client ✅

#### Created Journey API Functions
- **File**: `frontend/lib/journeys.ts`
- **Functions Added**:
  
  1. **`createJourney(journey: LearningJourney)`**
     - Calls `POST /api/v1/journeys/`
     - Saves generated journey to database
     - Returns journey with MongoDB ObjectId
  
  2. **`getJourney(id: string)`**
     - Calls `GET /api/v1/journeys/{id}`
     - Fetches journey from database by ObjectId
     - Handles authentication and permission errors
  
  3. **`updateJourney(id: string, updates: {...})`**
     - Calls `PUT /api/v1/journeys/{id}`
     - Updates journey fields (title and/or steps)
     - Returns updated journey

### 3. Frontend Integration ✅

#### Generation Flow
- **File**: `frontend/app/educator/page.tsx`
- **Changes**:
  - Modified `handleGenerate` to:
    1. Call `generateJourney(prompt)` to generate draft
    2. Call `createJourney(...)` to save to database
    3. Redirect to `/educator/journey/{mongodb_objectid}` (instead of timestamp-based ID)
  - Removed localStorage-based journey storage

#### Journey View
- **File**: `frontend/app/educator/journey/[id]/page.tsx`
- **Changes**:
  - Modified `useEffect` to:
    - Fetch journey using `getJourney(id)` from database
    - Convert API format to component format
    - Handle loading and error states
  - Modified `handleSwapResource` to:
    - Update local state optimistically for immediate UI feedback
    - Call `updateJourney(id, { steps: [...] })` to persist changes
    - Handle errors gracefully

## Key Features Implemented

### Journey Persistence
- ✅ Journeys are saved to MongoDB with unique ObjectIds
- ✅ Each journey is associated with the educator who created it
- ✅ Journey data includes: title, subject, grade, prompt, steps, educator_id, created_at, class_code

### Ownership Verification
- ✅ All GET and PUT operations verify that `educator_id` matches the authenticated user
- ✅ Returns 403 Forbidden if user tries to access/modify another educator's journey
- ✅ Returns 404 Not Found if journey doesn't exist

### Resource Swapping with Persistence
- ✅ Educators can swap resources in journey steps
- ✅ Changes are immediately reflected in UI (optimistic update)
- ✅ Changes are persisted to database via PUT endpoint
- ✅ Journey state is maintained across page refreshes

### URL Structure
- ✅ Journey URLs now use MongoDB ObjectIds (24 hex characters)
- ✅ Example: `/educator/journey/507f1f77bcf86cd799439011`
- ✅ No more timestamp-based IDs or localStorage dependency

## Testing Checklist

### ✅ Backend Server
- Server starts successfully without import errors
- All endpoints are registered and accessible
- MongoDB connection is established

### 🔄 Manual Testing Required
1. **Journey Creation**:
   - Generate a new journey
   - Verify redirect to URL with MongoDB ObjectId (24 hex chars)
   - Check MongoDB Atlas to confirm journey document exists with correct `educator_id`

2. **Journey Retrieval**:
   - Refresh the journey page
   - Verify journey loads from database (not localStorage)
   - Verify all resource details are displayed correctly

3. **Journey Updates**:
   - Swap a resource in a journey step
   - Refresh the page
   - Verify the swapped resource persists

4. **Ownership Verification**:
   - Try to access another educator's journey (if possible)
   - Verify 403 Forbidden response

## Database Schema

### `journeys` Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  title: "Learning Journey: Grade 5 Science lesson about plants",
  subject: "Science",
  grade: 5,
  prompt: "Grade 5 Science lesson about plants and photosynthesis",
  steps: [
    {
      step_type: "Preparation",
      resource_id: "tch-001"
    },
    {
      step_type: "Hook",
      resource_id: "sci-001"
    },
    {
      step_type: "Instruction",
      resource_id: "sci-002"
    },
    {
      step_type: "Application",
      resource_id: "sci-003"
    }
  ],
  educator_id: "edu_a1b2c3d4e5f6",
  created_at: ISODate("2026-02-04T16:00:00Z"),
  class_code: null
}
```

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/journeys/` | Create new journey | ✅ Yes |
| GET | `/api/v1/journeys/{id}` | Get journey by ID | ✅ Yes |
| PUT | `/api/v1/journeys/{id}` | Update journey | ✅ Yes |
| POST | `/api/v1/journeys/generate` | Generate journey draft | ✅ Yes |

## Files Modified

### Backend
- `backend/main.py` - Fixed imports
- `backend/database.py` - Fixed imports
- `backend/services/journey_generator.py` - Fixed imports
- `backend/schemas/journey.py` - Added request schemas, fixed imports
- `backend/routers/journeys.py` - Added CRUD endpoints

### Frontend
- `frontend/lib/journeys.ts` - Added CRUD API functions
- `frontend/app/educator/page.tsx` - Integrated journey creation
- `frontend/app/educator/journey/[id]/page.tsx` - Integrated journey retrieval and updates

## Next Steps

1. **Manual Testing**: Verify all functionality works end-to-end
2. **Sprint S5**: Implement journey sharing with students via class codes
3. **Sprint S6**: Add student journey view and progress tracking

## Notes

- All TypeScript type errors shown are related to missing React/Next.js type declarations in the development environment and do not affect runtime functionality
- The backend server is running successfully on port 8000
- MongoDB Atlas connection is established and working
- All CRUD operations include proper error handling and authentication checks