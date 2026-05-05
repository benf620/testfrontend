# Connect2Grow API Endpoints

**Base URL**: `http://localhost:8080`
**Framework**: Spring Boot
**Authentication**: HTTP Basic Auth
**CORS**: Enabled for `http://localhost:5172`

---

## Network Members (NWKR)

### GET `/api/nwkr`
**Description**: Get a network member by ID

**Request Parameters**:
- `id` (int, query) - Network member ID

**Response**:
```json
{
  "id": 1,
  "name": "string",
  "birthday": "2024-02-13T00:00:00",
  "email": "user@example.com",
  "teamsLink": "string",
  "bildungsgang": ["INFORMATIK", "WIRTSCHFTSINFORMATIK"],
  "officelocation": ["WINTERFELDSTRASSE"],
  "pictureLink": "string",
  "codinglanguages": ["PYTHON", "C", "CPP", "JAVA", "JAVASCRIPT", "ASM", "CSHARP"],
  "description": "string"
}
```

---

### POST `/api/nwkr`
**Description**: Create a new network member

**Request Body**:
```json
{
  "name": "string",
  "birthday": "2024-02-13T00:00:00",
  "email": "user@example.com",
  "bildungsgang": ["INFORMATIK"],
  "officelocation": ["WINTERFELDSTRASSE"],
  "pictureLink": "string",
  "codinglanguages": ["PYTHON"],
  "description": "string"
}
```

**Response**: No content (201 Created)

---

### PATCH `/api/nwkr`
**Description**: Update an existing network member

**Request Body**:
```json
{
  "id": 1,
  "uuid": "NWKR-1",
  "name": "string",
  "birthday": "2024-02-13T00:00:00",
  "email": "user@example.com",
  "bildungsgang": ["INFORMATIK"],
  "officelocation": ["WINTERFELDSTRASSE"],
  "pictureLink": "string",
  "codinglanguages": ["PYTHON"],
  "description": "string"
}
```

**Response**: No content (204 No Content)

---

### DELETE `/api/nwkr`
**Description**: Delete a single network member

**Request Parameters**:
- `id` (int, query) - Network member ID

**Response**: No content (204 No Content)

---

### DELETE `/api/nwkr/list/`
**Description**: Delete multiple network members

**Request Parameters**:
- `id` (ArrayList<Integer>, query) - List of network member IDs

**Response**: No content (204 No Content)

---

## Business Experts

### GET `/api/business-expert`
**Description**: Get a business expert by ID

**Request Parameters**:
- `id` (int, query) - Business expert ID

**Response**:

```json
{
  "id": 1,
  "uuid": "BE-1",
  "name": "string",
  "birthday": "2024-02-13T00:00:00",
  "email": "expert@example.com",
  "studied": true,
  "bereich": "string",
  "officelocation": [
    "WINTERFELDSTRASSE"
  ],
  "pictureLink": "string",
  "bildungBetreuen": [
    "INFORMATIK"
  ],
  "teamDescription": "string",
  "description": "string"
}
```

---

### POST `/api/business-expert`
**Description**: Create a new business expert

**Request Body**:

```json
{
  "name": "string",
  "birthday": "2024-02-13T00:00:00",
  "email": "expert@example.com",
  "studied": true,
  "bereich": "string",
  "officelocation": [
    "WINTERFELDSTRASSE"
  ],
  "pictureLink": "string",
  "bildungBetreuen": [
    "INFORMATIK"
  ],
  "teamDescription": "string",
  "description": "string"
}
```

**Response**: No content (201 Created)

---

### PATCH `/api/business-expert`
**Description**: Update an existing business expert

**Request Parameters**:
- `id` (int, query) - Business expert ID

**Request Body**:

```json
{
  "name": "string",
  "birthday": "2024-02-13T00:00:00",
  "email": "expert@example.com",
  "studied": true,
  "bereich": "string",
  "pictureLink": "string",
  "bildungBetreuen": [
    "INFORMATIK"
  ],
  "teamDescription": "string",
  "officelocation": [
    "WINTERFELDSTRASSE"
  ],
  "description": "string"
}
```

**Response**: No content (204 No Content)

---

### DELETE `/api/business-expert`
**Description**: Delete a business expert

**Request Parameters**:
- `id` (int, query) - Business expert ID

**Response**: No content (204 No Content)

---

## Likes

### GET `/api/like`
**Description**: Check if a like exists between two users

**Request Parameters**:
- `liker` (String, query) - UUID of user who liked (e.g., "NWKR-1")
- `liked` (String, query) - UUID of user who was liked (e.g., "BE-1")

**Response**:
```json
{
  "id": 1,
  "liker": "NWKR-1",
  "liked": "BE-1"
}
```
Returns empty if no like exists.

---

### POST `/api/like`
**Description**: Create a like relationship (automatically creates a match if mutual)

**Request Parameters**:
- `likerUuid` (String, query) - UUID of user who likes
- `likedUuid` (String, query) - UUID of user being liked

**Behavior**:
- Creates a like record
- If a reciprocal like exists, creates a Match and removes the reciprocal like

**Response**: No content (201 Created)

---

## Enums Reference

### Bildungsgang (Education Track)
- `INFORMATIK` - Computer Science
- `WIRTSCHFTSINFORMATIK` - Business Informatics

### OfficeLocation
- `WINTERFELDSTRASSE`

### CodingLanguages
- `PYTHON`
- `C`
- `CPP`
- `JAVA`
- `JAVASCRIPT`
- `ASM`
- `CSHARP`
