# Job Role API Documentation

This API provides endpoints to manage job roles for a job portal system. Each job role includes all the required properties for posting and managing job positions.

## Base URL
```
http://localhost:3000/api
```

## Data Models

### Job Role
A job role contains the following properties:
- **id**: Unique identifier (auto-generated)
- **jobRoleName**: Name of the job position
- **description**: Job description
- **responsibilities**: Job responsibilities
- **jobSpecLink**: Link to Job Spec in SharePoint
- **location**: Job location
- **capability**: Department/capability area
- **band**: Job band/level (Junior, Mid, Senior, etc.)
- **closingDate**: Application closing date
- **status**: Current status (active, closed, draft)
- **numberOfOpenPositions**: Number of available positions
- **createdAt**: Record creation timestamp
- **updatedAt**: Last update timestamp

## Endpoints

### 1. Get All Job Roles
```http
GET /api/jobs
```

Retrieve all job roles with optional filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `status` (optional): Filter by status (`active`, `closed`, `draft`)
- `capability` (optional): Filter by capability (partial match)
- `location` (optional): Filter by location (partial match)
- `band` (optional): Filter by band (exact match)

**Example Request:**
```bash
curl "http://localhost:3000/api/jobs?status=active&capability=Engineering&page=1&limit=5"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "jobRoleName": "Senior Software Engineer",
        "description": "We are looking for an experienced software engineer...",
        "responsibilities": "Design and develop scalable web applications...",
        "jobSpecLink": "https://company.sharepoint.com/sites/hr/jobs/senior-software-engineer",
        "location": "London, UK",
        "capability": "Engineering",
        "band": "Senior",
        "closingDate": "2025-12-03T12:00:00.000Z",
        "status": "active",
        "numberOfOpenPositions": 2,
        "createdAt": "2025-10-03T12:00:00.000Z",
        "updatedAt": "2025-10-03T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 2. Get Active Job Roles
```http
GET /api/jobs/active
```

Retrieve only active job roles (status = 'active' and closing date in the future).

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `capability` (optional): Filter by capability (partial match)
- `location` (optional): Filter by location (partial match)
- `band` (optional): Filter by band (exact match)

### 3. Get Job Role by ID
```http
GET /api/jobs/:id
```

Retrieve a specific job role by its ID.

**Example Request:**
```bash
curl "http://localhost:3000/api/jobs/1"
```

### 4. Create Job Role
```http
POST /api/jobs
```

Create a new job role.

**Request Body:**
```json
{
  "jobRoleName": "Frontend Developer",
  "description": "Join our frontend team to build amazing user interfaces",
  "responsibilities": "Develop React components, implement responsive designs, collaborate with UX team",
  "jobSpecLink": "https://company.sharepoint.com/sites/hr/jobs/frontend-developer",
  "location": "Manchester, UK",
  "capability": "Engineering",
  "band": "Mid",
  "closingDate": "2025-12-15T23:59:59.000Z",
  "numberOfOpenPositions": 2
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "jobRoleName": "Frontend Developer",
    "description": "Join our frontend team to build amazing user interfaces",
    "responsibilities": "Develop React components, implement responsive designs, collaborate with UX team",
    "jobSpecLink": "https://company.sharepoint.com/sites/hr/jobs/frontend-developer",
    "location": "Manchester, UK",
    "capability": "Engineering",
    "band": "Mid",
    "closingDate": "2025-12-15T23:59:59.000Z",
    "numberOfOpenPositions": 2
  }'
```

### 5. Update Job Role
```http
PUT /api/jobs/:id
```

Update an existing job role. Only provided fields will be updated.

**Request Body (all fields optional):**
```json
{
  "jobRoleName": "Senior Frontend Developer",
  "status": "closed",
  "numberOfOpenPositions": 1
}
```

### 6. Delete Job Role
```http
DELETE /api/jobs/:id
```

Delete a job role by ID.

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/jobs/1"
```

## Health Check

### Health Check Endpoint
```http
GET /api/health
```

Check API health status.

**Example Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-03T12:00:00.000Z",
  "service": "Job Role API"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid input)
- `404` - Not Found (Resource not found)
- `500` - Internal Server Error

## Usage Examples

### Filtering Job Roles
```bash
# Get active Engineering jobs in London
curl "http://localhost:3000/api/jobs/active?capability=Engineering&location=London"

# Get all jobs with Senior band
curl "http://localhost:3000/api/jobs?band=Senior"

# Get draft status jobs with pagination
curl "http://localhost:3000/api/jobs?status=draft&page=2&limit=5"
```

### Creating a Complete Job Role
```bash
curl -X POST "http://localhost:3000/api/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "jobRoleName": "DevOps Engineer",
    "description": "Experienced DevOps engineer needed for cloud infrastructure management",
    "responsibilities": "Manage AWS infrastructure, implement CI/CD pipelines, monitor system performance, ensure security compliance",
    "jobSpecLink": "https://company.sharepoint.com/sites/hr/jobs/devops-engineer-2024",
    "location": "Remote, UK",
    "capability": "Engineering",
    "band": "Senior",
    "closingDate": "2025-11-30T23:59:59.000Z",
    "numberOfOpenPositions": 1
  }'
```

### Updating Job Status
```bash
# Close a job application
curl -X PUT "http://localhost:3000/api/jobs/1" \
  -H "Content-Type: application/json" \
  -d '{"status": "closed"}'

# Update closing date
curl -X PUT "http://localhost:3000/api/jobs/1" \
  -H "Content-Type: application/json" \
  -d '{"closingDate": "2025-12-31T23:59:59.000Z"}'
```