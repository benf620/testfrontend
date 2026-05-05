# Connect2Grow Application Workflow

## Table of Contents
1. [Application Structure](#application-structure)
2. [User Configuration & Setup](#user-configuration--setup)
3. [Home Page - Swiping Workflow](#home-page---swiping-workflow)
4. [Profile Page Workflow](#profile-page-workflow)
5. [Matches Page Workflow](#matches-page-workflow)
6. [API Service Layer](#api-service-layer)
7. [Component Details](#component-details)

---

## Application Structure

```
src/
├── config/
│   └── user.js              # Current user configuration
├── services/
│   └── api.js               # API service layer
├── components/
│   ├── Header.jsx           # Navigation header
│   └── ProfileCard.jsx      # Reusable profile card component
├── pages/
│   ├── Home.jsx             # Swiping interface
│   ├── Profile.jsx          # User profile management
│   └── Matches.jsx          # Matches list and details
├── App.jsx                  # Main app with routing
└── main.jsx                 # Entry point
```

---

## User Configuration & Setup

### File: `src/config/user.js`

**Purpose**: Stores the current logged-in user information (hardcoded for development)

```javascript
export const currentUser = {
  uuid: "NWKR-1",  // Unique identifier for API calls
  id: 1,           // Numeric ID for fetching user data
  type: "NWKR"     // User type: "NWKR" or "BE"
};
```

**Functions:**
- `getSwipeTargetType()`: Returns which type of users to show when swiping
  - If current user is NWKR → returns "BE"
  - If current user is BE → returns "NWKR"

**When Used:**
- Imported in `Home.jsx` to determine which profiles to fetch
- Imported in `Profile.jsx` to load current user's profile
- Imported in API calls to identify the acting user

---

## Home Page - Swiping Workflow

### File: `src/pages/Home.jsx`

### Initial Load Flow

```
1. User navigates to "/" route
   ↓
2. Home component mounts
   ↓
3. State initialization:
   - display: true (shows welcome screen)
   - visible: true
   - currentProfile: null
   - currentProfileId: 1
   - loading: false
```

### Step-by-Step User Journey

#### Step 1: Welcome Screen

**State:**
```javascript
display = true
```

**UI Displayed:**
- Welcome message: "Welcome to Connect to Grow"
- Description: "Start connecting to your BE's"
- START button

**User Action:** Clicks START button

**Function Called:**
```javascript
onClick={() => setDisplay(false)}
```

**Result:**
- `display` → false
- Triggers useEffect that fetches first profile

---

#### Step 2: First Profile Fetch

**Trigger:** `useEffect` detects `display === false && currentProfile === null`

**Function Called:** `fetchNextProfile()`

**Flow:**
```
1. setLoading(true)
   ↓
2. getSwipeTargetType() → "BE" (if user is NWKR)
   ↓
3. Loop through IDs (currentProfileId + attempts):
   - Try: businessExpertApi.getById(1)
   - If fails: Try businessExpertApi.getById(2)
   - Continues for up to 10 attempts
   ↓
4. If profile found:
   - setCurrentProfile(profile)
   - setCurrentProfileId(found_id)
   ↓
5. setLoading(false)
```

**API Call:**
```javascript
businessExpertApi.getById(id)
  → GET http://localhost:8080/api/business-expert?id={id}
```

**Result:**
- `currentProfile` contains user data
- ProfileCard component renders with animation

---

#### Step 3: User Views Profile Card

**Component:** `<ProfileCard>`

**Props Passed:**
```javascript
<ProfileCard
  profile={currentProfile}        // Raw API data
  userType={getSwipeTargetType()} // "BE" or "NWKR"
  onSkip={handleSkip}            // Callback for skip
  onConnect={handleConnect}      // Callback for connect
  loading={loading}              // Loading state
/>
```

**ProfileCard Internal Flow:**

```
1. Receives raw profile data
   ↓
2. formatProfile(rawProfile, userType) called
   - Extracts birthday → calculates age
   - Maps fields based on userType
   - Formats education/skills data
   ↓
3. Returns formatted profile object:
   {
     uuid, name, birthYear, age, email,
     avatar, study, location, skills,
     description, etc.
   }
   ↓
4. Renders formatted data in UI
   ↓
5. User can:
   - Click "Read more" → toggles description
   - Click "Skip" → calls onSkip()
   - Click "Connect" → calls onConnect()
```

---

#### Step 4A: User Clicks "Skip"

**Function Called:** `handleSkip()`

**Flow:**
```
1. setExitDirection("left")
   ↓
2. setTimeout(() => setVisible(false), 10)
   - Card animates left and disappears
   ↓
3. After 300ms:
   - setVisible(true)
   - setCurrentProfile(null)
   - setCurrentProfileId(prev => prev + 1)
   ↓
4. useEffect triggers → fetchNextProfile()
   ↓
5. Next profile appears
```

**No API Call** - Just moves to next profile

---

#### Step 4B: User Clicks "Connect"

**Function Called:** `handleConnect()`

**Flow:**
```
1. setExitDirection("right")
   ↓
2. setTimeout(() => setVisible(false), 10)
   - Card animates right and disappears
   ↓
3. API Call: Create Like
   likeApi.create(currentUser.uuid, currentProfile.uuid)
   → POST http://localhost:8080/api/like?likerUuid=NWKR-1&likedUuid=BE-1
   ↓
4. Check for mutual like (Match):
   likeApi.check(currentProfile.uuid, currentUser.uuid)
   → GET http://localhost:8080/api/like?liker=BE-1&liked=NWKR-1
   ↓
5. If reciprocal like exists:
   - setMatchNotification("It's a Match! 🎉")
   - Backend automatically creates match and removes reciprocal like
   - Notification disappears after 3 seconds
   ↓
6. After 300ms:
   - setVisible(true)
   - setCurrentProfile(null)
   - setCurrentProfileId(prev => prev + 1)
   ↓
7. useEffect triggers → fetchNextProfile()
   ↓
8. Next profile appears
```

**API Calls:**
1. **POST** `/api/like` - Creates the like relationship
2. **GET** `/api/like` - Checks if reciprocal like exists (to detect match)

---

#### Step 5: No More Profiles

**Condition:** `fetchNextProfile()` tries 10 IDs but all fail

**Result:**
```javascript
currentProfile === null
visible === true
loading === false
```

**UI Displayed:**
- "No more profiles available"
- "Start Over" button
  - Resets: currentProfileId = 1, display = true

---

## Profile Page Workflow

### File: `src/pages/Profile.jsx`

### Initial Load Flow

```
1. User navigates to "/profile"
   ↓
2. Profile component mounts
   ↓
3. State initialization:
   - userType: currentUser.type (from config)
   - loading: true
   - nwkrForm: empty NWKR form
   - beForm: empty BE form
   ↓
4. useEffect triggers → fetchProfile()
```

---

### Profile Fetch Flow

**Function:** `fetchProfile()`

**Flow:**
```
1. setLoading(true)
   ↓
2. Check userType:

   If userType === "NWKR":
   ├─ Call: nwkrApi.getById(currentUser.id)
   ├─ GET http://localhost:8080/api/nwkr?id=1
   ├─ Response contains full NWKR profile
   ├─ Format birthday for datetime-local input
   └─ setNwkrForm(data)

   If userType === "BE":
   ├─ Call: businessExpertApi.getById(currentUser.id)
   ├─ GET http://localhost:8080/api/business-expert?id=1
   ├─ Response contains full BE profile
   ├─ Format birthday for datetime-local input
   └─ setBeForm(data)
   ↓
3. setLoading(false)
   ↓
4. Form renders with existing data
```

---

### User Type Toggle

**User Action:** Clicks "Network Member" or "Business Expert" button

**Function Called:**
```javascript
onClick={() => setUserType("NWKR")}  // or "BE"
```

**Flow:**
```
1. setUserType(newType)
   ↓
2. useEffect detects userType change
   ↓
3. fetchProfile() called again
   ↓
4. Fetches data for new user type
   ↓
5. Form switches to show different fields
```

---

### Form Input Changes

**NWKR Form Handler:** `handleNwkrChange(e)`

**BE Form Handler:** `handleBeChange(e)`

**Flow:**
```
1. User types in input or selects option
   ↓
2. onChange event fires
   ↓
3. Handler checks input type:

   If text/email/url input:
   └─ setForm(prev => ({ ...prev, [name]: value }))

   If select-multiple:
   ├─ Extract selected options
   ├─ Convert to array of values
   └─ setForm(prev => ({ ...prev, [name]: valuesArray }))

   If checkbox (BE only - "studied"):
   └─ setForm(prev => ({ ...prev, [name]: checked }))
   ↓
4. Form state updates → UI reflects change
```

---

### Form Submission

**User Action:** Clicks "Save Profile" button

**Function Called:** `handleSubmit(event)`

**Flow:**
```
1. event.preventDefault() - prevents page reload
   ↓
2. setSaving(true) - disables button, shows "Saving..."
   ↓
3. Prepare data:
   - Convert birthday string to ISO format
   - Get current form data (nwkrForm or beForm)
   ↓
4. Determine operation (Create or Update):

   If form.id exists:
   ├─ UPDATE operation
   │
   │  For NWKR:
   │  ├─ Call: nwkrApi.update(dataToSend)
   │  └─ PATCH http://localhost:8080/api/nwkr
   │     Body: { id, uuid, name, birthday, email, ... }
   │
   │  For BE:
   │  ├─ Call: businessExpertApi.update(id, dataToSend)
   │  └─ PATCH http://localhost:8080/api/business-expert?id=1
   │     Body: { name, birthday, email, studied, bereich, ... }

   If form.id is null/undefined:
   ├─ CREATE operation
   │
   │  For NWKR:
   │  ├─ Call: nwkrApi.create(dataToSend)
   │  └─ POST http://localhost:8080/api/nwkr
   │     Body: { name, birthday, email, ... }
   │
   │  For BE:
   │  ├─ Call: businessExpertApi.create(dataToSend)
   │  └─ POST http://localhost:8080/api/business-expert
   │     Body: { name, birthday, email, ... }
   ↓
5. Backend responds:
   - 201 Created (POST) or 204 No Content (PATCH)
   ↓
6. Success:
   - setMessage({ type: "success", text: "Profile updated!" })
   - Green notification appears

   Error:
   - setMessage({ type: "error", text: "Failed to save" })
   - Red notification appears
   ↓
7. setSaving(false) - re-enables button
```

---

## Matches Page Workflow

### File: `src/pages/Matches.jsx`

### Initial Load Flow

```
1. User navigates to "/matches"
   ↓
2. Matches component mounts
   ↓
3. State initialization:
   - matches: []
   - loading: true
   - selectedMatch: null
   ↓
4. useEffect triggers → fetchMatches()
```

---

### Fetch Matches Flow

**Function:** `fetchMatches()`

**Current Flow (Mock Data):**
```
1. setLoading(true)
   ↓
2. TODO: Real API call
   Expected: GET /api/matches?uuid=NWKR-1
   ↓
3. Currently: Returns mock data array
   [
     { id, uuid, name, email, pictureLink, bereich, description },
     ...
   ]
   ↓
4. setMatches(mockData)
   ↓
5. setLoading(false)
   ↓
6. Grid of match cards renders
```

**Future Implementation:**
```javascript
const response = await fetch(
  `http://localhost:8080/api/matches?uuid=${currentUser.uuid}`
);
const matches = await response.json();
setMatches(matches);
```

---

### Match List Display

**Rendering Flow:**
```
1. Check matches.length:

   If 0:
   └─ Show "No matches yet" message

   If > 0:
   └─ Map through matches array
      ↓
      For each match:
      ├─ Render card with:
      │  - Profile picture
      │  - Name
      │  - Bereich/field
      │  - Short description (2 lines)
      │  - "View Details" button
      │
      └─ Add onClick handler → openMatchDetails(match)
```

---

### View Match Details

**User Action:** Clicks match card or "View Details" button

**Function Called:** `openMatchDetails(match)`

**Flow:**
```
1. setSelectedMatch(match)
   ↓
2. AnimatePresence detects change
   ↓
3. Modal overlay appears (animated):
   - Background: semi-transparent black
   - Blocks page interaction
   ↓
4. Modal content renders:
   - Large profile picture
   - Full name
   - Email (clickable)
   - Bereich
   - Office location
   - Full description
   - Team description (if BE)
   - Bildung Betreuen (if BE)
   - Teams Link button (if available)
```

**Close Modal:**

User clicks:
- X button → `closeMatchDetails()`
- Background overlay → `closeMatchDetails()`

```javascript
closeMatchDetails() {
  setSelectedMatch(null)
  → Modal animates out and disappears
}
```

---

## API Service Layer

### File: `src/services/api.js`

### Base Configuration

```javascript
const BASE_URL = "http://localhost:8080";
```

### Helper Function: `handleResponse(response)`

**Purpose:** Process API responses consistently

**Flow:**
```
1. Check response.ok (status 200-299)

   If !response.ok:
   └─ throw Error with status and message

   If response.ok:
   ├─ Check status code
   │
   │  If 204 or 201 (No Content):
   │  └─ return null
   │
   │  Else:
   │  └─ return response.json()
```

---

### Network Members API: `nwkrApi`

#### `nwkrApi.getById(id)`
```
Purpose: Fetch a single NWKR by ID
Call: GET /api/nwkr?id={id}
Returns: Full NWKR object or throws error
```

#### `nwkrApi.create(data)`
```
Purpose: Create new NWKR
Call: POST /api/nwkr
Body: { name, birthday, email, bildungsgang, ... }
Headers: Content-Type: application/json
Returns: null (201 Created)
```

#### `nwkrApi.update(data)`
```
Purpose: Update existing NWKR
Call: PATCH /api/nwkr
Body: { id, uuid, name, birthday, email, ... }
Headers: Content-Type: application/json
Returns: null (204 No Content)
```

#### `nwkrApi.delete(id)`
```
Purpose: Delete NWKR
Call: DELETE /api/nwkr?id={id}
Returns: null (204 No Content)
```

---

### Business Experts API: `businessExpertApi`

#### `businessExpertApi.getById(id)`
```
Purpose: Fetch a single BE by ID
Call: GET /api/business-expert?id={id}
Returns: Full BE object or throws error
```

#### `businessExpertApi.create(data)`
```
Purpose: Create new BE
Call: POST /api/business-expert
Body: { name, birthday, email, studied, bereich, ... }
Headers: Content-Type: application/json
Returns: null (201 Created)
```

#### `businessExpertApi.update(id, data)`
```
Purpose: Update existing BE
Call: PATCH /api/business-expert?id={id}
Body: { name, birthday, email, ... }
Headers: Content-Type: application/json
Returns: null (204 No Content)
```

#### `businessExpertApi.delete(id)`
```
Purpose: Delete BE
Call: DELETE /api/business-expert?id={id}
Returns: null (204 No Content)
```

---

### Likes API: `likeApi`

#### `likeApi.check(likerUuid, likedUuid)`
```
Purpose: Check if a like exists
Call: GET /api/like?liker={likerUuid}&liked={likedUuid}
Returns: { id, liker, liked } or empty/null if not exists
Used: To check for mutual likes (matches)
```

#### `likeApi.create(likerUuid, likedUuid)`
```
Purpose: Create a like (and potentially a match)
Call: POST /api/like?likerUuid={likerUuid}&likedUuid={likedUuid}
Returns: null (201 Created)
Backend behavior:
  - Creates like record
  - If reciprocal like exists:
    → Creates Match
    → Removes reciprocal like
```

---

## Component Details

### ProfileCard Component

**File:** `src/components/ProfileCard.jsx`

**Purpose:** Reusable component to display user profiles

**Props:**
```javascript
{
  profile: object,    // Raw API profile data
  userType: string,   // "NWKR" or "BE"
  onSkip: function,   // Callback when skip clicked
  onConnect: function,// Callback when connect clicked
  loading: boolean    // Show loading state
}
```

**Internal State:**
```javascript
const [isOpen, setIsOpen] = useState(false);
// Controls description expand/collapse
```

**Key Functions:**

#### `formatProfile(data, userType)`

**Purpose:** Transform API data into display format

**Flow:**
```
1. Extract birthday → calculate birthYear and age
   ↓
2. Check userType:

   If "BE":
   └─ Return:
      {
        uuid, name, birthYear, age, email,
        avatar: pictureLink,
        study: bildungBetreuen.join(", "),
        location: officelocation.join(", "),
        bereich,
        teamDescription,
        description
      }

   If "NWKR":
   └─ Return:
      {
        uuid, name, birthYear, age, email,
        avatar: pictureLink,
        study: bildungsgang.join(", "),
        location: officelocation.join(", "),
        skills: codinglanguages,
        description
      }
```

**Rendering:**
```
1. If loading: Show loading spinner
2. If !profile: Return null
3. Else:
   ├─ Format profile data
   ├─ Display:
   │  - Avatar image
   │  - Name, birth year, age
   │  - Email
   │  - Study/Bildung Betreuen
   │  - Location
   │  - Skills (NWKR) or Bereich (BE)
   │  - Description (collapsible)
   │  - Connect button → calls onConnect()
   │  - Skip button → calls onSkip()
   └─ All styled with responsive design
```

---

## Complete User Journey Example

### Scenario: NWKR User Finds a Match

```
1. User opens app → "/" route
   ├─ App.jsx renders
   ├─ Header shows navigation
   └─ Home.jsx renders

2. Home shows welcome screen
   └─ User clicks START

3. Home.jsx:
   ├─ setDisplay(false)
   ├─ useEffect triggers
   └─ fetchNextProfile() called

4. fetchNextProfile():
   ├─ getSwipeTargetType() → "BE"
   ├─ businessExpertApi.getById(1)
   └─ GET /api/business-expert?id=1

5. Backend responds with BE profile:
   {
     id: 1,
     uuid: "BE-1",
     name: "Anna Schmidt",
     email: "anna@telekom.de",
     ...
   }

6. ProfileCard renders:
   ├─ formatProfile() formats data
   ├─ Shows Anna's profile
   └─ User reads description

7. User clicks "Connect":
   ├─ handleConnect() fires
   ├─ Card animates right
   └─ Two API calls:

   a) likeApi.create("NWKR-1", "BE-1")
      → POST /api/like?likerUuid=NWKR-1&likedUuid=BE-1
      → Backend creates like
      → Anna had already liked this user!
      → Backend creates Match record
      → Backend deletes Anna's like

   b) likeApi.check("BE-1", "NWKR-1")
      → GET /api/like?liker=BE-1&liked=NWKR-1
      → Returns empty (like was deleted when match created)
      → Or returns data if still exists
      → If reciprocal like exists:
        - setMatchNotification("It's a Match! 🎉")
        - Pink notification appears top-center

8. After 300ms:
   ├─ Card resets
   ├─ currentProfileId increments
   └─ fetchNextProfile() fetches next BE

9. User navigates to /matches:
   ├─ Matches.jsx renders
   ├─ fetchMatches() called
   └─ Shows list with Anna Schmidt

10. User clicks Anna's card:
    ├─ openMatchDetails(anna)
    ├─ Modal opens with full details
    └─ Shows "Open Teams Chat" button

11. User clicks Teams link:
    └─ Opens Microsoft Teams chat with Anna
```

---

## State Management Summary

### Global State (via config)
- `currentUser` - Current logged-in user info

### Home Page State
```javascript
display          // Shows welcome vs swipe interface
visible          // Controls card visibility for animations
exitDirection    // "left" or "right" for animation
currentProfile   // Currently displayed profile data
currentProfileId // ID counter for fetching next profiles
loading          // API fetch in progress
matchNotification // Match message display
```

### Profile Page State
```javascript
userType         // "NWKR" or "BE" - form type to show
loading          // Initial profile fetch
saving           // Form submission in progress
message          // Success/error message display
nwkrForm         // NWKR form data object
beForm           // BE form data object
```

### Matches Page State
```javascript
matches          // Array of match objects
loading          // Matches fetch in progress
selectedMatch    // Currently viewed match in modal
error            // Error message (for mock data note)
```

### ProfileCard State
```javascript
isOpen           // Description expanded state
```

---

## Animation Timing Reference

```
Card swipe exit:        300ms
Match notification:     3000ms display
Modal open/close:       200ms
Card initial appear:    200ms
Description expand:     300ms
```

---

## API Endpoints Quick Reference

| Method | Endpoint | Purpose | Used In |
|--------|----------|---------|---------|
| GET | `/api/nwkr?id={id}` | Get NWKR by ID | Profile.jsx |
| POST | `/api/nwkr` | Create NWKR | Profile.jsx |
| PATCH | `/api/nwkr` | Update NWKR | Profile.jsx |
| GET | `/api/business-expert?id={id}` | Get BE by ID | Home.jsx, Profile.jsx |
| POST | `/api/business-expert` | Create BE | Profile.jsx |
| PATCH | `/api/business-expert?id={id}` | Update BE | Profile.jsx |
| GET | `/api/like?liker={uuid}&liked={uuid}` | Check like | Home.jsx |
| POST | `/api/like?likerUuid={uuid}&likedUuid={uuid}` | Create like | Home.jsx |
| GET | `/api/matches?uuid={uuid}` | Get matches | Matches.jsx (TODO) |

---

## Error Handling

### API Errors
```
API call fails
  ↓
handleResponse() throws error
  ↓
try/catch in component catches error
  ↓
Options:
- Log to console
- Show error message to user
- Use fallback/mock data
- Reset state and retry
```

### Profile Not Found
```
fetchNextProfile() tries ID
  ↓
businessExpertApi.getById(id) fails
  ↓
Caught in try/catch
  ↓
Continue to next ID (up to 10 attempts)
  ↓
If all fail: setCurrentProfile(null)
  ↓
Show "No more profiles" message
```

---

## Testing Checklist

- [ ] Change `currentUser` in config to test different perspectives
- [ ] Create test NWKR and BE users in backend
- [ ] Test swiping through multiple profiles
- [ ] Test connecting (like) functionality
- [ ] Test match notification appears correctly
- [ ] Test profile creation (both types)
- [ ] Test profile updates (both types)
- [ ] Test form validation
- [ ] Test responsive design on mobile
- [ ] Test dark mode appearance
- [ ] Verify all API calls have correct URLs
- [ ] Test "no more profiles" state
- [ ] Test empty matches list
- [ ] Test match details modal
