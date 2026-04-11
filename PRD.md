
# PART 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product Name

**CivicFix – Community Issue Reporting Platform**

---

# 1. Product Overview

CivicFix is a **web-based civic issue reporting system** that enables citizens to report public infrastructure problems in their locality. These issues may include garbage accumulation, potholes, broken street lights, water leakage, stray animals, traffic hazards, and public safety concerns.

The platform allows users to quickly report issues by:

* Capturing or uploading an image
* Automatically detecting their GPS location
* Selecting a category
* Providing a short description

Users do **not need to create an account** to submit complaints.

Municipal authorities can access an **admin dashboard** to manage incoming complaints, update issue status, assign workers, and monitor resolution progress.

The goal of CivicFix is to improve **communication, transparency, and responsiveness between citizens and local authorities.**

---

# 2. Problem Statement

Many civic issues remain unresolved due to:

* Lack of structured reporting systems
* Manual complaint processes
* Poor communication between citizens and authorities
* Absence of real-time tracking
* No centralized system for issue management

Currently, citizens report issues via:

* phone calls
* social media
* local offices

These methods lack **tracking, visibility, and accountability.**

A digital platform is required that allows:

* easy complaint submission
* real-time issue monitoring
* faster resolution workflow

---

# 3. Goals & Objectives

## Primary Goals

1. Enable citizens to report issues quickly.
2. Provide location-based issue reporting.
3. Allow authorities to monitor and resolve complaints efficiently.

---

## Secondary Goals

1. Improve civic participation.
2. Provide transparent issue tracking.
3. Identify high-problem areas using location data.
4. Reduce resolution time of civic issues.

---

# 4. Target Users

## 1. Citizens

Residents who report issues in their local area.

Typical actions:

* Report issues
* Upload images
* Track complaints

---

## 2. Municipal Authorities

Government officials responsible for monitoring and resolving civic issues.

Typical actions:

* View complaints
* Update complaint status
* Assign workers
* Mark issues as resolved

---

## 3. Field Workers

Workers assigned to fix reported issues.

Typical actions:

* View assigned complaints
* Upload resolution image
* Mark completion

---

# 5. Core Functional Features

---

# 5.1 Complaint Submission (No Login Required)

Users should be able to submit complaints **without authentication**.

Required Information:

Name
Phone Number
Issue Category
Issue Description

Optional Information:

Email Address

Media:

Image upload (required)

---

# 5.2 Image Capture & Upload

Users must be able to:

* Capture an image using device camera
* Upload image from device gallery

Image uploading will be handled using **Cloudinary JavaScript SDK** on the frontend.

Supported formats:

* JPG
* JPEG
* PNG

Images will be stored on **Cloudinary** and the returned **image URL** will be stored in MongoDB.

---

# 5.3 Location Detection

When a user opens the complaint form:

1. The system requests **GPS permission** from the browser.
2. Latitude and longitude are captured automatically.
3. A **map preview** is shown to the user.

Location information stored:

Latitude
Longitude

---

# 5.4 Issue Categories

Users must select an issue category.

Initial categories:

Garbage
Broken Street Light
Pothole / Road Damage
Water Leakage
Traffic Issue
Public Toilet Problem
Safety Concern
Stray Animals

These categories will be stored in the **database** so they can be managed later.

---

# 5.5 Map-Based Issue Visualization

The platform will display all complaints on an **interactive map**.

Each issue appears as a marker.

Marker color indicates status:

Red → Reported
Yellow → In Progress
Green → Resolved

Clicking a marker opens the **Issue Details Page**.

Map integration may use:

Google Maps
or
Mapbox

---

# 5.6 Issue Tracking

Each complaint will receive a **unique complaint ID**.

Users can track the issue using:

* Complaint ID
* Phone Number

The system displays:

Issue status
Date reported
Current progress

---

# 5.7 Issue Status Lifecycle

Each complaint follows this lifecycle:

Reported
Under Review
In Progress
Resolved

Only **admins** can update the status.

---

# 5.8 Duplicate Issue Detection

Before saving a complaint:

The backend checks if another complaint exists within **100 meters radius** with the same category.

If a similar issue exists:

The user is shown a message:

"This issue may already be reported nearby."

User options:

Support existing issue
Submit new complaint anyway

---

# 5.9 Admin Dashboard

Authorities have access to a **secure admin panel**.

Admin capabilities:

View all complaints
Filter complaints by status
Filter complaints by category
Filter complaints by location
Update issue status
Assign worker
Upload resolution image
Mark issue as resolved

---

# 5.10 Resolution Proof Upload

When resolving an issue, the worker or admin must upload a **resolution image**.

Resolution images will also be uploaded to **Cloudinary**.

---

# 6. Technology Stack

## Frontend

ReactJS (Vite)
Tailwind CSS
Axios (API communication)
Cloudinary JS SDK (image upload)

---

## Backend

FastAPI (Python)
Pydantic validation
Uvicorn server

---

## Database

MongoDB

Collections:

complaints
workers
categories

---

## Image Storage

Cloudinary

Images stored:

Complaint image
Resolution image

---

# 7. Database Design

## Complaints Collection

Fields:

complaint_id
name
phone_number
email
category
description
image_url
latitude
longitude
status
assigned_worker_id
resolution_image_url
created_at
updated_at

---

## Workers Collection

Fields:

worker_id
name
phone_number
department
created_at

---

## Categories Collection

Fields:

category_id
name
created_at

---

# 8. User Flow

Citizen opens CivicFix website

↓

User clicks **Report Issue**

↓

User uploads image

↓

GPS location is detected

↓

User selects issue category

↓

User enters name and phone number

↓

User submits complaint

↓

Complaint stored in database

↓

Complaint appears on map

↓

Admin reviews complaint

↓

Worker assigned

↓

Worker fixes issue

↓

Resolution image uploaded

↓

Complaint marked resolved

---

# 9. Non-Functional Requirements

## Performance

The system must support **high concurrent complaint submissions**.

---

## Security

Phone numbers must be stored securely.
API must validate all inputs.

---

## Usability

The platform must be:

* Simple
* Mobile friendly
* Accessible for non-technical users

---

## Responsiveness

The interface must be **fully responsive** and optimized for mobile devices.

---

# 10. Success Metrics

Success of CivicFix will be measured using:

Number of complaints reported
Number of complaints resolved
Average resolution time
User engagement with the platform

---

# 11. Future Enhancements

AI-based issue detection from images

Issue heatmap analytics

SMS notifications for complaint updates

Mobile apps (Android / iOS)

Integration with government systems


# PART 2 — BACKEND API CONTRACT (FASTAPI)

## 1. API Base Configuration

Base URL

```
/api/v1
```

Content Type

```
application/json
```

Authentication

```
Admin endpoints require JWT authentication
Citizen complaint submission does NOT require authentication
```

---

# 2. Global Response Format

All APIs must follow a consistent response structure.

## Success Response

```
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error Response

```
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_IDENTIFIER"
}
```

---

# 3. Complaint APIs

---

# 3.1 Create Complaint

Creates a new civic issue report.

### Endpoint

```
POST /api/v1/complaints
```

### Request Body

```
{
  "name": "Akshay",
  "phone_number": "9876543210",
  "email": "akshay@email.com",
  "category": "Garbage",
  "description": "Garbage pile near street corner",
  "image_url": "https://res.cloudinary.com/.../image.jpg",
  "latitude": 17.3850,
  "longitude": 78.4867
}
```

### Backend Logic

1. Validate request fields
2. Check duplicate complaint within 100 meters
3. Generate unique complaint ID
4. Save complaint in MongoDB
5. Return complaint ID

---

### Response

```
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": {
    "complaint_id": "CMP_874123",
    "status": "Reported"
  }
}
```

---

# 3.2 Duplicate Complaint Detection

Before creating a complaint, the system checks nearby complaints.

### Endpoint

```
POST /api/v1/complaints/check-duplicate
```

### Request

```
{
  "category": "Garbage",
  "latitude": 17.3850,
  "longitude": 78.4867
}
```

### Backend Logic

Use MongoDB geospatial query.

Check complaints within **100 meter radius**.

---

### Response (Duplicate Found)

```
{
  "success": true,
  "duplicate_found": true,
  "existing_complaints": [
    {
      "complaint_id": "CMP_101",
      "category": "Garbage",
      "status": "Reported",
      "distance": 42
    }
  ]
}
```

---

### Response (No Duplicate)

```
{
  "success": true,
  "duplicate_found": false
}
```

---

# 3.3 Get Complaint by ID

Fetch details of a specific complaint.

### Endpoint

```
GET /api/v1/complaints/{complaint_id}
```

### Response

```
{
  "success": true,
  "data": {
    "complaint_id": "CMP_874123",
    "name": "Akshay",
    "phone_number": "9876543210",
    "category": "Garbage",
    "description": "Garbage pile near street corner",
    "image_url": "https://cloudinary.com/img.jpg",
    "latitude": 17.3850,
    "longitude": 78.4867,
    "status": "In Progress",
    "resolution_image_url": null,
    "created_at": "2026-03-15T10:10:00"
  }
}
```

---

# 3.4 Track Complaints by Phone Number

Users can check complaints using their phone number.

### Endpoint

```
GET /api/v1/complaints/track/{phone_number}
```

### Response

```
{
  "success": true,
  "data": [
    {
      "complaint_id": "CMP_874123",
      "category": "Garbage",
      "status": "Reported",
      "created_at": "2026-03-15"
    }
  ]
}
```

---

# 3.5 Get All Complaints (Admin)

### Endpoint

```
GET /api/v1/complaints
```

### Query Parameters

```
status
category
page
limit
```

Example

```
/api/v1/complaints?status=Reported&page=1&limit=10
```

---

### Response

```
{
  "success": true,
  "data": {
    "total": 120,
    "page": 1,
    "complaints": []
  }
}
```

---

# 3.6 Get Complaints for Map View

Used by frontend map component.

### Endpoint

```
GET /api/v1/complaints/map
```

### Response

```
{
  "success": true,
  "data": [
    {
      "complaint_id": "CMP_123",
      "latitude": 17.385,
      "longitude": 78.486,
      "status": "Reported",
      "category": "Garbage"
    }
  ]
}
```

---

# 4. Complaint Status Management (Admin)

---

# 4.1 Update Complaint Status

### Endpoint

```
PUT /api/v1/complaints/{complaint_id}/status
```

### Request

```
{
  "status": "In Progress"
}
```

Allowed values:

```
Reported
Under Review
In Progress
Resolved
```

---

### Response

```
{
  "success": true,
  "message": "Status updated"
}
```

---

# 4.2 Assign Worker

### Endpoint

```
PUT /api/v1/complaints/{complaint_id}/assign-worker
```

### Request

```
{
  "worker_id": "WRK_1001"
}
```

---

### Response

```
{
  "success": true,
  "message": "Worker assigned successfully"
}
```

---

# 4.3 Upload Resolution Image

Image uploaded to **Cloudinary from frontend**, backend stores URL.

### Endpoint

```
PUT /api/v1/complaints/{complaint_id}/resolution
```

### Request

```
{
  "resolution_image_url": "https://cloudinary.com/resolution.jpg"
}
```

---

### Response

```
{
  "success": true,
  "message": "Resolution image uploaded"
}
```

---

# 5. Worker APIs

---

# 5.1 Create Worker

### Endpoint

```
POST /api/v1/workers
```

### Request

```
{
  "name": "Ravi Kumar",
  "phone_number": "9876540000",
  "department": "Sanitation"
}
```

---

### Response

```
{
  "success": true,
  "data": {
    "worker_id": "WRK_1001"
  }
}
```

---

# 5.2 Get Workers

### Endpoint

```
GET /api/v1/workers
```

---

### Response

```
{
  "success": true,
  "data": [
    {
      "worker_id": "WRK_1001",
      "name": "Ravi Kumar",
      "department": "Sanitation"
    }
  ]
}
```

---

# 6. Category APIs

---

# 6.1 Get All Categories

### Endpoint

```
GET /api/v1/categories
```

---

### Response

```
{
  "success": true,
  "data": [
    {
      "category_id": "CAT_1",
      "name": "Garbage"
    },
    {
      "category_id": "CAT_2",
      "name": "Pothole"
    }
  ]
}
```

---

# 6.2 Create Category (Admin)

### Endpoint

```
POST /api/v1/categories
```

### Request

```
{
  "name": "Water Leakage"
}
```

---

# 7. Admin Authentication APIs

---

# 7.1 Admin Login

### Endpoint

```
POST /api/v1/admin/login
```

### Request

```
{
  "email": "admin@civicfix.com",
  "password": "password123"
}
```

---

### Response

```
{
  "success": true,
  "data": {
    "access_token": "JWT_TOKEN"
  }
}
```

---

# 8. Error Handling

Common error codes:

```
INVALID_REQUEST
COMPLAINT_NOT_FOUND
WORKER_NOT_FOUND
CATEGORY_NOT_FOUND
UNAUTHORIZED
DUPLICATE_COMPLAINT
```

---

# 9. Rate Limiting

To prevent spam complaints:

```
Max 5 complaints per phone number per hour
```

---

# 10. Pagination Rules

All list endpoints support:

```
?page=1
&limit=10
```

Default:

```
page=1
limit=10
```

# PART 3 — COMPLETE PROJECT FOLDER STRUCTURE

The project will be structured as a **monorepo** containing both frontend and backend.

```
civicfix-platform
│
├── backend
├── frontend
├── docs
├── .env.example
├── README.md
```

---

# 1. Backend Structure (FastAPI)

```
backend
│
├── app
│
│   ├── main.py
│   ├── config.py
│   ├── dependencies.py
│
│   ├── database
│   │   ├── mongodb.py
│   │   └── indexes.py
│
│   ├── models
│   │   ├── complaint_model.py
│   │   ├── worker_model.py
│   │   ├── category_model.py
│   │   └── admin_model.py
│
│   ├── schemas
│   │   ├── complaint_schema.py
│   │   ├── worker_schema.py
│   │   ├── category_schema.py
│   │   └── auth_schema.py
│
│   ├── routes
│   │   ├── complaint_routes.py
│   │   ├── worker_routes.py
│   │   ├── category_routes.py
│   │   └── auth_routes.py
│
│   ├── services
│   │   ├── complaint_service.py
│   │   ├── worker_service.py
│   │   └── category_service.py
│
│   ├── repositories
│   │   ├── complaint_repository.py
│   │   ├── worker_repository.py
│   │   └── category_repository.py
│
│   ├── utils
│   │   ├── duplicate_detection.py
│   │   ├── geo_utils.py
│   │   ├── id_generator.py
│   │   └── validators.py
│
│   ├── middleware
│   │   ├── auth_middleware.py
│   │   └── rate_limit.py
│
│   └── constants
│       └── statuses.py
│
├── requirements.txt
├── run.py
└── .env
```

---

# Backend Folder Explanation

## main.py

Entry point of FastAPI.

Responsibilities:

* Initialize FastAPI app
* Register routers
* Enable CORS
* Connect database

---

## config.py

Stores configuration variables.

Examples:

```
MONGODB_URL
DATABASE_NAME
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
```

---

## database/

### mongodb.py

Responsible for MongoDB connection.

Functions:

```
connect_db()
get_database()
```

---

### indexes.py

Creates MongoDB indexes.

Examples:

```
location index
category index
status index
```

---

## models/

Defines MongoDB document structure.

### complaint_model.py

Fields:

```
complaint_id
name
phone_number
email
category
description
image_url
latitude
longitude
status
assigned_worker_id
resolution_image_url
created_at
updated_at
```

---

### worker_model.py

```
worker_id
name
phone_number
department
created_at
```

---

### category_model.py

```
category_id
name
created_at
```

---

### admin_model.py

```
admin_id
email
password_hash
created_at
```

---

## schemas/

Pydantic validation schemas.

### complaint_schema.py

```
CreateComplaintRequest
ComplaintResponse
ComplaintStatusUpdate
DuplicateCheckRequest
```

---

### worker_schema.py

```
CreateWorkerRequest
WorkerResponse
```

---

### category_schema.py

```
CreateCategoryRequest
CategoryResponse
```

---

### auth_schema.py

```
AdminLoginRequest
AuthTokenResponse
```

---

## routes/

Defines API endpoints.

### complaint_routes.py

Endpoints:

```
POST /complaints
GET /complaints
GET /complaints/{id}
GET /complaints/map
POST /complaints/check-duplicate
PUT /complaints/{id}/status
PUT /complaints/{id}/assign-worker
PUT /complaints/{id}/resolution
```

---

### worker_routes.py

```
POST /workers
GET /workers
```

---

### category_routes.py

```
GET /categories
POST /categories
```

---

### auth_routes.py

```
POST /admin/login
```

---

## services/

Contains business logic.

Example:

### complaint_service.py

Responsibilities:

```
create_complaint()
check_duplicate_complaint()
update_complaint_status()
assign_worker()
get_complaints_map()
```

---

## repositories/

Handles database queries.

Example:

```
insert_complaint()
find_complaint_by_id()
find_nearby_complaints()
update_complaint_status()
```

---

## utils/

Helper utilities.

### duplicate_detection.py

Logic for detecting complaints within **100m radius**.

---

### geo_utils.py

Distance calculations.

---

### id_generator.py

Generate IDs like:

```
CMP_874123
WRK_101
```

---

### validators.py

Phone number validation.

---

## middleware/

### auth_middleware.py

JWT validation.

---

### rate_limit.py

Prevents spam complaints.

Example rule:

```
Max 5 complaints per phone number per hour
```

---

# 2. Frontend Structure (Vite + React + Tailwind)

```
frontend
│
├── public
│   └── civicfix-logo.png
│
├── src
│
│   ├── api
│   │   ├── axiosClient.js
│   │   ├── complaintApi.js
│   │   ├── workerApi.js
│   │   └── categoryApi.js
│
│   ├── components
│   │   ├── Navbar.jsx
│   │   ├── IssueCard.jsx
│   │   ├── MapView.jsx
│   │   ├── ImageUploader.jsx
│   │   ├── StatusBadge.jsx
│   │   └── LoadingSpinner.jsx
│
│   ├── pages
│   │   ├── HomePage.jsx
│   │   ├── ReportIssuePage.jsx
│   │   ├── IssueDetailsPage.jsx
│   │   ├── TrackComplaintPage.jsx
│   │   └── AdminDashboard.jsx
│
│   ├── hooks
│   │   ├── useLocation.js
│   │   └── useComplaints.js
│
│   ├── services
│   │   └── cloudinaryUpload.js
│
│   ├── context
│   │   └── AdminContext.jsx
│
│   ├── utils
│   │   ├── constants.js
│   │   └── helpers.js
│
│   ├── styles
│   │   └── global.css
│
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

# Frontend Folder Explanation

## api/

Handles backend communication using **Axios**.

Example:

```
createComplaint()
getComplaints()
getMapComplaints()
updateStatus()
```

---

## components/

Reusable UI components.

Examples:

### IssueCard.jsx

Displays complaint preview.

---

### MapView.jsx

Displays map with issue markers.

---

### ImageUploader.jsx

Handles Cloudinary upload.

Uses:

```
Cloudinary JS SDK
```

Returns:

```
image_url
```

---

## pages/

Main application pages.

### HomePage

Displays:

* map
* recent complaints

---

### ReportIssuePage

Complaint submission form.

---

### IssueDetailsPage

Displays complaint details.

---

### TrackComplaintPage

Track issues via phone number.

---

### AdminDashboard

Admin management interface.

Features:

```
complaint list
filters
status update
worker assignment
```

---

## hooks/

Custom React hooks.

### useLocation.js

Uses browser geolocation API.

Returns:

```
latitude
longitude
```

---

## services/

### cloudinaryUpload.js

Handles image uploads to Cloudinary.

Steps:

1 Upload image
2 Receive secure URL
3 Return image URL

---

## context/

### AdminContext

Stores admin authentication state.

---

## styles/

Global styles with TailwindCSS.

---

# 3. Environment Variables

Example `.env`

Backend

```
MONGODB_URI=
DATABASE_NAME=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Frontend

```
VITE_API_BASE_URL=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

---

# 4. Deployment Ready Setup

Recommended deployment:

Backend

```
Render
Railway
AWS
```

Frontend

```
Vercel
Netlify
```

Database

```
MongoDB Atlas
```

Images

```
Cloudinary
```

