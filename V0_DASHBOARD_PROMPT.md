# Business Tour Management Dashboard - v0 Mega Prompt

## Project Overview
Create a comprehensive **Business Tour Management Dashboard** for a tour enterprise company that manages corporate business tours for agencies. The system should handle end-to-end tour operations including transportation, accommodation, employee tracking, real-time communication, and task management.

---

## Core Features Required

### 1. **Dashboard Home/Overview**
- **Tour Statistics Cards**: Total tours, active tours, completed tours, pending approvals
- **Current Active Tours**: Quick view of all ongoing tours with status badges
- **Metrics**: Employee count by status (in-transit, at-hotel, at-venue, returning), transportation breakdown
- **Recent Activities Timeline**: Last 10 activities (employee checkin, status updates, messages, etc.)
- **Quick Actions Panel**: Start tour, add employee, create task, send announcement

### 2. **Tour Management**
- **Create/Edit Tour**: 
  - Tour name, start date, end date, destination city, budget
  - Agency name (dropdown/autocomplete)
  - Expected employee count
  - Description/itinerary
- **Tour List View**: All tours with filters (active, completed, draft, cancelled)
- **Tour Detail Page**: 
  - Full itinerary and timeline
  - Employee list with individual status
  - Transportation details
  - Hotel assignments
  - Total expenses breakdown
  - Tour documents/attachments

### 3. **Employee Management**
- **Add Employees to Tour**: Bulk import (CSV), manual entry, or invite by email
- **Employee List**: 
  - Status badges (not-joined, joined, in-transit, at-hotel, at-venue, returning, completed)
  - Contact info, role/department, tag management
  - Quick status update button
- **Employee Profile Card**: 
  - Personal details, contact, emergency contact
  - Current assignment (transportation, hotel, tasks)
  - Chat history with employee
  - Activity log

### 4. **Transportation Management**
- **Book Transportation**:
  - Type (plane, train, car, van, bus, helicopter, yacht, etc.)
  - Departure & arrival details (city, airport, station, time)
  - Passenger count, seat assignments
  - Carrier/company info, booking reference
  - Cost per person
  - Special requirements (wheelchair accessible, etc.)
- **Transportation Timeline**: Visual timeline of all transport legs
- **Track Status**: Update live status (boarding, departed, en-route, delayed, arrived)
- **Live Tracking Map**: Show current location of transport (if GPS available)

### 5. **Hotel Management**
- **Search & Book Hotels**:
  - Destination city filter
  - Check-in/check-out dates
  - Number of rooms, bed type preferences
  - Budget per room
  - Star rating filter, amenities (WiFi, gym, pool, parking, etc.)
- **Room Assignments**: 
  - Assign employees to rooms (multiple per room possible)
  - Track which employees are in which room
  - Room service requests
- **Hotel Details Card**:
  - Address, phone, website
  - Check-in/out times
  - Amenities list
  - Contact person at hotel
  - Emergency procedures

### 6. **Real-Time Chat & Communication**
- **Chat with Individual Employees**: Direct messaging with each employee
- **Group Chat by Tour**: All employees in a tour can chat
- **Announcements**: Send tour-wide announcements (system messages)
- **Chat Features**:
  - Text messages
  - Photo/file sharing
  - Timestamps, read receipts
  - Pin important messages
  - Search messages
- **Notification System**: In-app notifications, optional email/SMS alerts

### 7. **Task & Activity Management**
- **Create Tasks**:
  - Task title, description, due date/time
  - Assign to specific employee or group of employees
  - Priority (high, medium, low)
  - Category (visit-venue, document-submission, meeting, etc.)
  - Checklist items
- **Task Board**: Kanban view (not-started, in-progress, completed, overdue)
- **Employee Task List**: What tasks are assigned to each employee
- **Activity Feed**: 
  - Timestamps of all events (employee joined, status changed, message sent, task completed, etc.)
  - Filter by type, date range, employee

### 8. **Status Updates & Tracking**
- **Manual Status Update**:
  - Change employee status (from dropdown or buttons)
  - Add time, location, notes
  - Available statuses: Not-joined, Joined, In-transit (specific leg), At-hotel, At-venue, At-meeting, Returning, Completed
- **Location Tracking**:
  - Manual location update (admin updates on behalf of employee)
  - Employee self-check-in
  - Last known location display on map
  - Check-in history
- **Status Timeline**: Show all status changes with timestamps
- **Batch Status Update**: Update multiple employees' status at once

### 9. **Reports & Analytics**
- **Tour Report**:
  - Attendance summary (joined/not-joined)
  - Total expenses breakdown (transport, hotel, misc)
  - Timeline adherence (delays, early arrivals)
  - Completion rate
  - Export to PDF/Excel
- **Employee Report**:
  - Individual employee journey (all status updates)
  - All tasks and completion status
  - Communications summary
- **Financial Dashboard**:
  - Budget vs actual spend
  - Per-person cost
  - Cost breakdown by category (transport, hotel, meals, etc.)

### 10. **Settings & Administration**
- **User Roles**:
  - Tour Admin (our company) - full access to all tours
  - Agency Admin - access only to their agency's tours
  - Employee - view own tour info, chat, update own status
- **Tour Settings**:
  - Edit basic info
  - Add/remove employees
  - Configure available statuses
  - Manage tour admins
- **Expense Categories**: Custom categories for miscellaneous expenses
- **Emergency Contacts**: Setup emergency contacts for quick access

---

## Database Schema (Tables Needed)

```
users
├── id, name, email, password, phone, role (tour_admin, agency_admin, employee)
├── agency_id (nullable, for agency admins/employees)
└── created_at, updated_at

agencies
├── id, name, email, phone, contact_person
└── created_at, updated_at

tours
├── id, name, description, destination_city
├── start_date, end_date
├── status (draft, active, completed, cancelled)
├── total_budget, total_actual_spend
├── agency_id
├── created_by_user_id
└── created_at, updated_at

tour_employees
├── id, tour_id, employee_id
├── current_status (not-joined, joined, in-transit, at-hotel, at-venue, returning, completed)
├── current_location, last_status_update_time
├── assigned_hotel_id, room_number
├── special_notes
└── created_at, updated_at

transportation_bookings
├── id, tour_id
├── type (plane, train, car, van, bus, etc.)
├── departure_city, departure_airport/station, departure_time
├── arrival_city, arrival_airport/station, arrival_time
├── carrier_name, booking_reference
├── total_passengers, total_cost
├── status (booked, confirmed, boarding, departed, en-route, delayed, arrived, completed)
├── special_requirements
└── created_at, updated_at

transport_assignments
├── id, transportation_id, tour_employee_id
├── seat_number
└── created_at

hotel_bookings
├── id, tour_id
├── hotel_name, address, city, phone, website
├── check_in_date, check_out_date
├── rooms_needed, room_type
├── total_nights, cost_per_night, total_cost
├── booking_reference, status (pending, confirmed, checked-in, checked-out)
├── contact_person, emergency_info
└── created_at, updated_at

hotel_room_assignments
├── id, hotel_id, room_number, room_type
├── bed_type, max_occupants
└── created_at

room_occupants
├── id, room_assignment_id, tour_employee_id
└── created_at, updated_at

tasks
├── id, tour_id
├── title, description, category
├── assigned_to_user_id (nullable, if null then for all employees)
├── assigned_to_tour_id (if for whole tour)
├── due_date, due_time
├── priority (high, medium, low)
├── status (not-started, in-progress, completed, overdue)
├── created_by_user_id
└── created_at, updated_at

task_checklist_items
├── id, task_id
├── item_text, is_completed
└── created_at, updated_at

task_assignments
├── id, task_id, tour_employee_id
├── status (not-started, in-progress, completed)
└── created_at, updated_at

messages
├── id, tour_id (nullable, for tour group chat)
├── sender_user_id, recipient_user_id (nullable for group)
├── message_content
├── message_type (text, photo, file, announcement)
├── attachment_url
├── is_read, read_at
└── created_at

status_update_logs
├── id, tour_employee_id
├── previous_status, new_status
├── location, timestamp, notes
├── updated_by_user_id
└── created_at

expenses
├── id, tour_id
├── category (transport, hotel, meals, activities, misc)
├── description, amount, currency
├── date_incurred, payment_status
├── receipt_url
├── created_by_user_id
└── created_at, updated_at

notifications
├── id, user_id
├── type, title, message
├── related_tour_id, related_employee_id
├── is_read
└── created_at
```

---

## API Endpoints Needed

### Tours
- `GET /api/tours` - List all tours (with filters: status, agency, date range)
- `GET /api/tours/{id}` - Get tour details with all related data
- `POST /api/tours` - Create new tour
- `PUT /api/tours/{id}` - Update tour details
- `DELETE /api/tours/{id}` - Cancel/delete tour
- `GET /api/tours/{id}/employees` - Get all employees in tour
- `GET /api/tours/{id}/statistics` - Get tour metrics and statistics
- `GET /api/tours/{id}/timeline` - Get activity timeline
- `GET /api/tours/{id}/expenses` - Get expenses breakdown
- `POST /api/tours/{id}/export-pdf` - Export tour report

### Employees
- `GET /api/tour-employees` - List all tour employees (with filters)
- `GET /api/tour-employees/{id}` - Get employee details
- `POST /api/tours/{id}/employees` - Add employee to tour
- `PUT /api/tour-employees/{id}` - Update employee info
- `DELETE /api/tour-employees/{id}` - Remove employee from tour
- `POST /api/tour-employees/bulk-import` - Bulk add employees (CSV)
- `GET /api/tour-employees/{id}/activity-log` - Get employee activity history
- `GET /api/tour-employees/{id}/tasks` - Get employee's tasks

### Transportation
- `GET /api/transportation` - List all transportation bookings
- `POST /api/tours/{id}/transportation` - Create transportation booking
- `PUT /api/transportation/{id}` - Update transportation details
- `PUT /api/transportation/{id}/status` - Update transportation status
- `POST /api/transportation/{id}/assign-passengers` - Assign employees to seats
- `GET /api/transportation/{id}/passengers` - Get all passengers on transport

### Hotels
- `GET /api/hotels` - Search available hotels
- `GET /api/tour-hotels` - List booked hotels for tours
- `POST /api/tours/{id}/hotels` - Book hotel for tour
- `PUT /api/hotels/{id}` - Update hotel booking
- `POST /api/hotels/{id}/assign-rooms` - Assign employees to rooms
- `GET /api/hotels/{id}/room-assignments` - Get room assignments

### Tasks
- `GET /api/tasks` - List all tasks (with filters)
- `GET /api/tours/{id}/tasks` - Get tasks for a specific tour
- `POST /api/tours/{id}/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PUT /api/tasks/{id}/status` - Update task status
- `POST /api/tasks/{id}/assign` - Assign task to employee(s)
- `POST /api/task-checklist/{id}/toggle` - Toggle checklist item

### Messages & Chat
- `GET /api/messages` - Get chat history (with filters: tour, user)
- `POST /api/messages` - Send message
- `GET /api/messages/{id}` - Get message details
- `PUT /api/messages/{id}/read` - Mark as read
- `POST /api/messages/{id}/pin` - Pin message
- `GET /api/messages/search` - Search messages

### Status Updates
- `GET /api/status-logs/{employee-id}` - Get status update history
- `POST /api/tour-employees/{id}/status-update` - Update employee status
- `GET /api/tour-employees/{id}/current-location` - Get current location
- `POST /api/tour-employees/{id}/check-in` - Employee self check-in

### Reports & Analytics
- `GET /api/tours/{id}/report` - Get comprehensive tour report
- `GET /api/financial-summary` - Get financial overview
- `POST /api/reports/export-pdf` - Export custom reports

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

---

## UI/UX Components Needed

### Pages
1. Dashboard (home/overview)
2. Tours List & Filter
3. Tour Details (with tabs: Overview, Employees, Transportation, Hotels, Tasks, Chat, Reports)
4. Create/Edit Tour
5. Employee Management
6. Chat Page
7. Tasks & Board
8. Reports
9. Settings

### Reusable Components
- Status Badge (employee status, tour status, task status)
- Employee Card
- Transportation Card
- Hotel Card
- Task Card / Task Item
- Chat Message Bubble
- Activity Timeline
- Metrics/Stats Card
- Data Table with Filters & Pagination
- Modal Forms
- Map Component (for location display)

---

## Technology Stack
- **Frontend**: React (with hooks) + TypeScript
- **Backend**: Laravel REST API (already existing)
- **Database**: MySQL (via XAMPP)
- **Real-time**: WebSockets (Laravel Reverb) or Polling
- **Charts/Analytics**: Recharts or Chart.js
- **UI Framework**: Tailwind CSS or shadcn/ui
- **Form Management**: React Hook Form or Formik
- **State Management**: Context API or Zustand

---

## Key Considerations

1. **Real-time Updates**: Use WebSockets for live chat, status updates, and activity feeds
2. **Role-Based Access**: Different views for Tour Admin, Agency Admin, and Employees
3. **Responsive Design**: Mobile-friendly for on-the-go updates
4. **Data Validation**: Ensure all inputs are validated both frontend and backend
5. **Error Handling**: Graceful error messages and fallbacks
6. **Performance**: Optimize API calls, use pagination, lazy loading
7. **Security**: JWT authentication, role-based authorization
8. **Offline Support**: Cache critical data for offline access

---

## Deliverables from v0
1. Fully functional React dashboard component
2. Integration ready with Laravel backend
3. Database schema SQL file
4. API documentation/routes
5. Component structure and styling
6. Authentication & role management setup
7. Real-time chat functionality
8. Status tracking & location features
9. Reporting/export capabilities
