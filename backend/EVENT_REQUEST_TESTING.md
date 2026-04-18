# Event Request API Testing Guide

## Sample Event Request JSON Files

Three sample files are provided for testing the Event Request API:

1. **sample-event-request.json** - Standard event request with all major fields
2. **sample-event-request-minimal.json** - Minimal request with only required fields
3. **sample-event-request-complete.json** - Comprehensive request with all optional fields populated

## API Endpoint

**POST** `/event-request`

## Testing with cURL

### Basic Event Request (Minimal)

```bash
curl -X POST http://localhost:5000/api/event-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @sample-event-request-minimal.json
```

### Standard Event Request

```bash
curl -X POST http://localhost:5000/api/event-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @sample-event-request.json
```

### Complete Event Request

```bash
curl -X POST http://localhost:5000/api/event-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @sample-event-request-complete.json
```

## Testing with Postman

1. Create a new POST request
2. URL: `http://localhost:5000/api/event-request`
3. Headers:
   - Key: `Content-Type` | Value: `application/json`
   - Key: `Authorization` | Value: `Bearer YOUR_TOKEN_HERE`
4. Body (raw JSON): Copy content from one of the sample JSON files
5. Click Send

## Getting a Bearer Token

To get a token, first login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@nexora.edu",
    "password": "admin123"
  }'
```

Use the returned `token` in the Authorization header.

## Field Reference

### Required Fields

- `title` - Event name
- `eventType` - Type of event (e.g., "Conference", "Workshop", "Exhibition")
- `purposeTag` - Purpose category (e.g., "Educational", "Cultural", "Sports")
- `purposeDescription` - Detailed description of event purpose
- `eventDate` - Date in YYYY-MM-DD format
- `startTime` - Time in HH:MM format
- `endTime` - Time in HH:MM format
- `setupTime` - Time in HH:MM format
- `teardownTime` - Time in HH:MM format
- `audience` - Target audience

### Optional Fields

- `organizingBody` - Club or organization name
- `contactName` - Organizer name
- `contactId` - Student/Staff ID
- `contactPhone` - Phone number
- `contactEmail` - Email address
- `supervisorName` - Faculty supervisor
- `supervisorDepartment` - Department name
- `supervisorPhone` - Supervisor phone
- `venue` - Event location
- `expectedAttendance` - Estimated number
- `seatingArrangement` - Type of seating
- `parkingRequired` - Boolean (true/false)
- `estimatedBudget` - Budget amount
- `budgetBreakdown` - Budget details
- `sponsorshipDetails` - Sponsorship info
- `fundSource` - Funding sources
- `riskAssessment` - Identified risks
- `safetyMeasures` - Safety protocols
- `emergencyPlan` - Emergency procedures
- `contingency` - Backup plans

## Expected Response

### Success (201 Created)

```json
{
  "success": true,
  "message": "Event request created successfully",
  "eventRequest": {
    "id": 1,
    "title": "Annual Tech Innovation Summit 2026",
    "status": "PENDING",
    "submittedBy": 2,
    "submittedAt": "2026-04-11T12:34:56.789Z",
    ...
  }
}
```

### Error (400 Bad Request)

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

## Notes

- All dates should be in `YYYY-MM-DD` format
- All times should be in `HH:MM` format (24-hour)
- User must be authenticated (token required)
- Event request will be created with `PENDING` status
- Budget and attendance are optional but recommended
