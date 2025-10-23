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

### 2. Search Job Roles
```http
GET /api/job-roles/search
```

Search and filter job roles with pagination support. All parameters are optional.

**Query Parameters:**
- `search` (optional): Case-insensitive partial match on job role name (max 200 characters)
- `capability` (optional): Exact match on capability field
- `location` (optional): Exact match on location field
- `band` (optional): Exact match on band field
- `status` (optional): Case-insensitive exact match on status field (e.g., "Open", "Closed")
- `page` (optional): Page number (starts at 1, default: 1)
- `limit` (optional): Items per page (default: 12, max: 100)

**Filter Logic:**
- All provided filters use AND logic (all must match)
- Search parameter performs case-insensitive partial matching on `jobRoleName` only
- Status parameter performs case-insensitive exact match on `status` field
- Empty/missing parameters are ignored

**Example Requests:**
```bash
# Basic search
curl "http://localhost:8000/api/job-roles/search?search=engineer"

# Filter by status only (Open positions)
curl "http://localhost:8000/api/job-roles/search?status=Open"

# Search with status filter
curl "http://localhost:8000/api/job-roles/search?search=developer&status=Open"

# Search with multiple filters
curl "http://localhost:8000/api/job-roles/search?search=senior&capability=Engineering&location=Belfast,%20Northern%20Ireland&band=Senior&status=Open&page=1&limit=12"

# Filter without search
curl "http://localhost:8000/api/job-roles/search?capability=Engineering&band=Senior&status=Open"

# Pagination with search
curl "http://localhost:8000/api/job-roles/search?search=developer&page=2&limit=12"
```

**Example Success Response:**
```json
{
  "success": true,
  "data": {
    "jobRoles": [
      {
        "id": 1,
        "jobRoleName": "Senior Software Engineer",
        "description": "...",
        "responsibilities": "...",
        "jobSpecLink": "https://...",
        "location": "Belfast, Northern Ireland",
        "capability": "Engineering",
        "band": "Senior",
        "closingDate": "2025-12-31T23:59:59.000Z",
        "status": "Open",
        "numberOfOpenPositions": 3,
        "createdAt": "2025-10-03T12:00:00.000Z",
        "updatedAt": "2025-10-03T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 58,
      "limit": 12,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

**Example Empty Results Response:**
```json
{
  "success": true,
  "data": {
    "jobRoles": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 0,
      "totalCount": 0,
      "limit": 12,
      "hasNext": false,
      "hasPrevious": false
    }
  }
}
```

**Error Responses:**
```json
// Invalid pagination
{
  "success": false,
  "error": "Invalid page number. Must be a positive integer."
}

// Search term too long
{
  "success": false,
  "error": "Search term must be 200 characters or less"
}

// Server error
{
  "success": false,
  "error": "An error occurred while searching job roles."
}
```

### 3. Get Filter Options

#### Get Capabilities
```http
GET /api/job-roles/capabilities
```

Returns list of unique capabilities from all job roles.

**Example Request:**
```bash
curl "http://localhost:8000/api/job-roles/capabilities"
```

**Example Response:**
```json
{
  "success": true,
  "data": ["Engineering", "Analytics", "Product", "Design", "Quality Assurance", "Documentation", "Testing"]
}
```

#### Get Locations
```http
GET /api/job-roles/locations
```

Returns list of unique locations from all job roles.

**Example Request:**
```bash
curl "http://localhost:8000/api/job-roles/locations"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    "Belfast, Northern Ireland",
    "Birmingham, England",
    "Derry~Londonderry, Northern Ireland",
    "Dublin, Ireland",
    "London, England",
    "Remote"
  ]
}
```

#### Get Bands
```http
GET /api/job-roles/bands
```

Returns list of unique bands from all job roles.

**Example Request:**
```bash
curl "http://localhost:8000/api/job-roles/bands"
```

**Example Response:**
```json
{
  "success": true,
  "data": ["Junior", "Mid", "Senior", "Lead", "Principal"]
}
```

### 4. Get Active Job Roles
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

### 5. Get Job Role by ID
```http
GET /api/jobs/:id
```

Retrieve a specific job role by its ID.

**Example Request:**
```bash
curl "http://localhost:3000/api/jobs/1"
```

### 6. Create Job Role
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

### 7. Update Job Role
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

### 8. Delete Job Role
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

---

## Job Applications API

### Application Data Model
A job application contains:
- **id**: Unique identifier (auto-generated)
- **jobRoleId**: ID of the job role being applied for
- **applicantName**: Name of the applicant
- **applicantEmail**: Email address of the applicant
- **coverLetter**: Optional cover letter text
- **resumeUrl**: Optional external resume URL
- **cvFileName**: Name of the uploaded CV file
- **cvMimeType**: MIME type of the CV file
- **hasCv**: Boolean indicating if CV data exists
- **status**: Application status (`in progress`, `pending`, `under_review`, `shortlisted`, `rejected`, `hired`)
- **submittedAt**: Application submission timestamp
- **updatedAt**: Last update timestamp
- **jobRole**: Embedded job role details (when applicable)

### 1. Submit Job Application (with CV Upload)
```http
POST /api/applications
Content-Type: multipart/form-data
```

Submit a new job application with CV file upload.

**Requirements:**
- Job role must have status `"active"`
- Job role must have `numberOfOpenPositions > 0`
- CV file is required (PDF, DOC, or DOCX)
- Maximum file size: 5MB
- Applicant can only apply once per job role

**Form Data Fields:**
- `cv` (file, required): CV file to upload
- `jobRoleId` (number, required): ID of the job role
- `applicantName` (string, required): Name of applicant
- `applicantEmail` (string, required): Valid email address
- `coverLetter` (string, optional): Cover letter text
- `resumeUrl` (string, optional): External resume URL

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/applications" \
  -F "cv=@/path/to/resume.pdf" \
  -F "jobRoleId=1" \
  -F "applicantName=Jane Smith" \
  -F "applicantEmail=jane.smith@example.com" \
  -F "coverLetter=I am very interested in this position because..."
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "jobRoleId": 1,
    "applicantName": "Jane Smith",
    "applicantEmail": "jane.smith@example.com",
    "coverLetter": "I am very interested in this position because...",
    "cvFileName": "resume.pdf",
    "cvMimeType": "application/pdf",
    "hasCv": true,
    "status": "in progress",
    "submittedAt": "2025-10-14T10:30:00.000Z",
    "updatedAt": "2025-10-14T10:30:00.000Z"
  },
  "message": "Application submitted successfully"
}
```

### 2. Get All Applications
```http
GET /api/applications
```

Retrieve all applications with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status
- `jobRoleId` (optional): Filter by job role ID
- `applicantEmail` (optional): Filter by applicant email

**Example Request:**
```bash
curl "http://localhost:3000/api/applications?status=in+progress&jobRoleId=1"
```

### 3. Get Application by ID
```http
GET /api/applications/:id
```

Retrieve a specific application by ID.

**Example Request:**
```bash
curl "http://localhost:3000/api/applications/1"
```

### 4. Download Application CV
```http
GET /api/applications/:id/cv
```

Download the CV file for a specific application.

**Example Request:**
```bash
# Download and save to file
curl "http://localhost:3000/api/applications/1/cv" --output cv.pdf

# View headers
curl -I "http://localhost:3000/api/applications/1/cv"
```

**Response Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="resume.pdf"
Content-Length: 245678
```

### 5. Update Application
```http
PUT /api/applications/:id
Content-Type: multipart/form-data
```

Update an existing application's cover letter and/or CV file. Applications can only be updated while in editable status.

**URL Parameters:**
- `id` (number, required): The unique identifier of the application to update

**Form Data Fields:**
- `coverLetter` (string, optional): Updated cover letter text (max 5000 characters)
- `cv` (file, optional): New CV file to replace existing one (PDF, DOC, or DOCX, max 5MB)

**Editable Statuses:**
Applications can only be updated if their current status is:
- `pending`
- `in progress`
- `under_review`

**Notes:**
- At least one field (`coverLetter` or `cv`) must be provided
- If `cv` is not provided, the existing CV remains unchanged
- If `coverLetter` is not provided, the existing cover letter remains unchanged
- The `applicantName`, `applicantEmail`, and `jobRoleId` cannot be changed via this endpoint
- `submittedAt` remains unchanged; `updatedAt` is set to current timestamp

**Example Request (Update Cover Letter Only):**
```bash
curl -X PUT "http://localhost:3000/api/applications/1" \
  -F "coverLetter=I am excited to apply for this position. I have 5 years of experience..."
```

**Example Request (Update CV Only):**
```bash
curl -X PUT "http://localhost:3000/api/applications/1" \
  -F "cv=@/path/to/updated_resume.pdf"
```

**Example Request (Update Both):**
```bash
curl -X PUT "http://localhost:3000/api/applications/1" \
  -F "coverLetter=Updated cover letter text..." \
  -F "cv=@/path/to/new_cv.pdf"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Application updated successfully",
  "data": {
    "id": 1,
    "jobRoleId": 63,
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@example.com",
    "coverLetter": "Updated cover letter text...",
    "cvFileName": "new_cv.pdf",
    "cvMimeType": "application/pdf",
    "hasCv": true,
    "status": "in progress",
    "submittedAt": "2025-10-23T10:23:17.000Z",
    "updatedAt": "2025-10-23T15:30:00.000Z",
    "jobRole": {
      "id": 63,
      "jobRoleName": "Senior Product Designer",
      "description": "...",
      "location": "Paris, France",
      "capability": "Design",
      "band": "Senior",
      "closingDate": "2026-01-21T14:54:25.000Z",
      "status": "Open",
      "numberOfOpenPositions": 2
    }
  }
}
```

**Error Response (403 Forbidden - Non-Editable Status):**
```json
{
  "success": false,
  "message": "Applications can only be updated while in 'pending', 'in progress', or 'under_review' status"
}
```

**Error Response (400 Bad Request - No Updates Provided):**
```json
{
  "success": false,
  "message": "No updates provided. Please provide a cover letter or CV file to update."
}
```

**Error Response (400 Bad Request - Invalid File Type):**
```json
{
  "success": false,
  "message": "Invalid file type. Only PDF, DOC, and DOCX files are allowed"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Application not found"
}
```

### 6. Get Applications for Job Role
```http
GET /api/applications/job-role/:jobRoleId
```

Retrieve all applications for a specific job role.

**Example Request:**
```bash
curl "http://localhost:3000/api/applications/job-role/1"
```

### 7. Get Applications by User Email
```http
GET /api/applications/user/:email
```

Retrieve all job applications submitted by a user identified by their email address. Returns applications ordered by submission date (newest first).

**URL Parameters:**
- `email` (string, required): The applicant's email address (URL-encoded)

**Example Request:**
```bash
# Note: @ symbol must be URL-encoded as %40
curl "http://localhost:3000/api/applications/user/john.doe%40example.com"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "jobRoleId": 5,
      "applicantName": "John Doe",
      "applicantEmail": "john.doe@example.com",
      "coverLetter": "I am very interested in this position because...",
      "resumeUrl": "http://localhost:8000/uploads/cvs/application-1-cv.pdf",
      "hasCv": true,
      "cvFileName": "john_doe_cv.pdf",
      "cvMimeType": "application/pdf",
      "status": "pending",
      "submittedAt": "2025-10-23T10:30:00.000Z",
      "updatedAt": "2025-10-23T10:30:00.000Z",
      "jobRole": {
        "id": 5,
        "jobRoleName": "Software Engineer",
        "description": "We are looking for a talented software engineer...",
        "responsibilities": "Design, develop, and maintain software applications...",
        "jobSpecLink": "https://example.com/job-specs/software-engineer.pdf",
        "location": "Belfast",
        "capability": "Engineering",
        "band": "Associate",
        "closingDate": "2025-11-30T00:00:00.000Z",
        "status": "open",
        "numberOfOpenPositions": 3,
        "createdAt": "2025-10-01T00:00:00.000Z",
        "updatedAt": "2025-10-01T00:00:00.000Z"
      }
    },
    {
      "id": 2,
      "jobRoleId": 8,
      "applicantName": "John Doe",
      "applicantEmail": "john.doe@example.com",
      "coverLetter": null,
      "resumeUrl": "http://localhost:8000/uploads/cvs/application-2-cv.pdf",
      "hasCv": true,
      "cvFileName": "john_doe_cv_updated.pdf",
      "cvMimeType": "application/pdf",
      "status": "under_review",
      "submittedAt": "2025-10-20T14:15:00.000Z",
      "updatedAt": "2025-10-21T09:00:00.000Z",
      "jobRole": {
        "id": 8,
        "jobRoleName": "Senior Developer",
        "description": "...",
        "responsibilities": "...",
        "jobSpecLink": "...",
        "location": "London",
        "capability": "Engineering",
        "band": "Consultant",
        "closingDate": "2025-12-15T00:00:00.000Z",
        "status": "open",
        "numberOfOpenPositions": 2,
        "createdAt": "2025-09-15T00:00:00.000Z",
        "updatedAt": "2025-09-15T00:00:00.000Z"
      }
    }
  ]
}
```

**Response for User with No Applications:**
```json
{
  "success": true,
  "data": []
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid email format",
  "error": "Email parameter is required and must be valid"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to fetch user applications",
  "error": "Database connection error"
}
```

**Notes:**
- Email parameter must be URL-encoded (e.g., `@` becomes `%40`)
- Results are ordered by `submittedAt` in descending order (newest first)
- Each application includes nested job role details
- Returns empty array if user has no applications
- Frontend can use this endpoint for "My Applications" features

### 8. Delete Application
```http
DELETE /api/applications/:id
```

Delete a job application.

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/applications/1"
```

## Application Workflow

### For Applicants
1. **Check Eligibility**: Ensure job role status is `"active"` and has open positions
2. **Prepare CV**: File must be PDF, DOC, or DOCX (max 5MB)
3. **Submit Application**: Use multipart/form-data POST request
4. **Track Status**: Application starts as `"in progress"`

### For Recruiters
1. **Review Applications**: GET all applications for a job role
2. **Download CVs**: Download CV files for review
3. **Update Status**: Move applications through the hiring pipeline
4. **Filter Applications**: Filter by status to manage workflow

## Error Codes

### Application-Specific Errors
- `400` - CV file required / Invalid file type / File too large
- `400` - Job role not accepting applications (not "open" or no positions)
- `404` - Job role not found / Application not found
- `409` - Already applied for this job role
- `500` - Internal server error