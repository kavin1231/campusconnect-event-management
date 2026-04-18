# Testing Event Request Flow (End-to-End)

## Step 1: Start Both Servers

### Terminal 1 - Backend

```bash
cd backend
npm run dev
# Server should run on http://localhost:5000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
# Frontend should run on http://localhost:5173 (or similar)
```

---

## Step 2: Login as Event Organizer

1. Navigate to **http://localhost:5173** (or your frontend URL)
2. Click **Login**
3. Enter credentials:
   - **Email**: `organizer@nexora.edu`
   - **Password**: `admin123`
4. Click **Login**

You should see the **Event Organizer Dashboard**

---

## Step 3: Navigate to Request Permission Form

1. From the dashboard, look for **"Event Management"** section in sidebar
2. Click on **"Request Permission"** or **"My Events"**
3. Find the button to **"Create New Event Request"** or **"Request Permission"**

---

## Step 4: Fill Out the Event Request Form

The form has 5 steps. Fill them out with this sample data:

### **Step 1: Basic Event Information**

- **Event Title**: `Campus Tech Hackathon 2026`
- **Type of Event**: Select `Workshop`
- **Purpose**: Select `Educational`
- **Brief Description**: `A 24-hour coding competition where student teams build innovative solutions. Provides networking opportunities with industry mentors and prizes.`
- **Event Date**: `2026-05-20`
- **Start Time**: `09:00`
- **End Time**: `18:00`
- **Setup Start**: `08:00`
- **Teardown End**: `19:00`
- **Target Audience**: `University-Wide (Staff + Students)`

### **Step 2: Organizer Details**

- **Organizing Body**: Select `Computer Science Club`
- **Primary Contact Person**:
  - **Full Name**: `Kavin Silva`
  - **Student/Staff ID**: `CS2021001`
  - **Phone Number**: `077-1234567`
  - **Email**: `kavin@nexora.edu`

- **Supervising Faculty**:
  - **Supervisor Name**: `Dr. Chamali Fernando`
  - **Faculty/Department**: `Faculty of Computing`
  - **Contact Number**: `011-2345678`

### **Step 3: Venue & Logistics**

- **Proposed Venue**: `Main Auditorium`
- **Expected Attendance**: `300`
- **Seating Arrangement**: `Theater Style`
- **Parking Required**: Toggle `ON`

### **Step 4: Financials & Sponsorship**

- **Estimated Budget**: `250000`
- **Budget Breakdown**: `Speakers: 100000, Equipment: 80000, Catering: 70000`
- **Sponsorship Details**: `Seeking tech company sponsorships. Booth space available.`
- **Fund Source**: Select `Student Activity Fund`

### **Step 5: Risk Management & Safety**

- **Risk Assessment**: `Large crowd management, electrical equipment safety`
- **Safety Measures**: `Campus Security present, First aid team on standby`
- **Emergency Plan**: `Emergency exits marked, evacuation routes planned`
- **Contingency Plan**: `Secondary venue available if needed`

### **Step 6: Final Review**

- Review all information
- Click **"Submit Permission Request"**

---

## Step 5: Verify Submission

### Expected Success Response

After clicking submit, you should see:

- ✅ Success message: `"Event request submitted successfully"`
- Event request appears in **"My Event Requests"** list
- Status shows: **`PENDING`**

### Check Database Directly (Optional)

Connect to PostgreSQL and verify:

```sql
SELECT * FROM "EventRequest"
WHERE title = 'Campus Tech Hackathon 2026'
ORDER BY submittedAt DESC LIMIT 1;
```

Expected columns populated:

- `id`: Auto-generated ID
- `title`: `Campus Tech Hackathon 2026`
- `status`: `PENDING`
- `submittedBy`: User ID (organizer's user ID)
- `submittedAt`: Current timestamp
- All other fields we filled in

---

## Step 6: View Submitted Request

1. In organizer dashboard, go to **"My Event Requests"**
2. Click on the event request you just created
3. You should see all your submitted data displayed

---

## Troubleshooting

### Error: "Unauthorized"

- Make sure you're logged in
- Check that the token is being sent in Authorization header

### Error: "Missing required fields"

- Ensure all required fields (marked with \*) are filled
- Check field formats:
  - Dates should be `YYYY-MM-DD`
  - Times should be `HH:MM`
  - Phone numbers should be properly formatted

### Error: "Invalid event date"

- Date must be in the future
- Format must be `YYYY-MM-DD`

### Error: "Event already exists"

- Each event request is unique, but the same title might already exist
- Try a slightly different title

### Request not appearing in database

1. Check backend logs for errors
2. Verify the token is valid
3. Check if the request actually submitted by:
   - Looking at browser Network tab
   - Checking if a response was received from backend
4. Verify database connection is active

---

## API Endpoint Details

**POST** `/api/event-requests`

**Headers Required:**

```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body Structure:** (Case-sensitive snake_case)

```json
{
  "title": "string",
  "eventType": "string",
  "eventTypeOther": "string or null",
  "purposeTag": "string",
  "purposeDescription": "string",
  "eventDate": "YYYY-MM-DD or ISO DateTime",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "setupTime": "HH:MM",
  "teardownTime": "HH:MM",
  "audience": "string",
  "organizingBody": "string (optional)",
  "contactName": "string (optional)",
  "contactId": "string (optional)",
  "contactPhone": "string (optional)",
  "contactEmail": "string (optional)",
  "supervisorName": "string (optional)",
  "supervisorDepartment": "string (optional)",
  "supervisorPhone": "string (optional)",
  "venue": "string (optional)",
  "expectedAttendance": "number (optional)",
  "seatingArrangement": "string (optional)",
  "parkingRequired": "boolean (optional)",
  "estimatedBudget": "number (optional)",
  "budgetBreakdown": "string (optional)",
  "sponsorshipDetails": "string (optional)",
  "fundSource": "string (optional)",
  "riskAssessment": "string (optional)",
  "safetyMeasures": "string (optional)",
  "emergencyPlan": "string (optional)",
  "contingency": "string (optional)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Event request created successfully",
  "eventRequest": {
    "id": 1,
    "title": "Campus Tech Hackathon 2026",
    "status": "PENDING",
    "submittedBy": 2,
    "submittedAt": "2026-04-11T12:30:45.123Z"
  }
}
```

---

## Summary

After following these steps, you should have:
✅ Logged in as event organizer
✅ Filled out 5-step event request form
✅ Successfully submitted the request
✅ Seen it appear in your requests list
✅ Verified it's in the database with PENDING status

If all steps complete successfully, the Event Request flow is working correctly!
