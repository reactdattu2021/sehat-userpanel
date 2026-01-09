# Nurse API Integration Summary

## Overview
Successfully integrated nurse booking pages with backend APIs, following the same pattern as the equipment pages.

## Changes Made

### 1. API Functions Added (`src/apis/authapis.js`)

Added three new API functions for nurse services:

#### `getAllNursesApi(page, limit)`
- **Endpoint**: `GET /user/getallservices`
- **Purpose**: Fetch all nurses with pagination
- **Parameters**: 
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

#### `getNurseByIdApi(nurseId)`
- **Endpoint**: `GET /user/getservice/{nurseId}`
- **Purpose**: Fetch individual nurse details by ID
- **Parameters**: 
  - `nurseId`: The unique ID of the nurse

#### `getNurseFiltersApi(filters)`
- **Endpoint**: `GET /user/servicefilters`
- **Purpose**: Fetch nurses with applied filters
- **Filter Parameters**:
  - `subCategory`: Nurse category (e.g., "Elderly Care Nurse", "Post-Surgery Care")
  - `location`: City/location filter
  - `experience`: Years of experience
  - `gender`: Gender filter (male/female)
  - `page`: Page number
  - `limit`: Items per page

---

### 2. BookNurse Component (`src/pages/book-nurse/BookNurse.jsx`)

**Key Features Implemented:**

#### State Management
- `nurses`: Array of nurse data from API
- `loading`: Loading state
- `currentPage`, `totalPages`, `total`: Pagination state
- `filters`: Object containing all filter values
- `isFilterActive`: Tracks if filters are applied

#### API Integration
- Fetches nurses on component mount
- Supports both filtered and unfiltered data fetching
- Automatic re-fetch on page change or filter toggle

#### Filter System
Implemented filters for:
- **Nurse Category** (subCategory): Dropdown selection
- **Location**: Text input for city/state
- **Experience**: Dropdown for years of experience
- **Gender**: Dropdown for male/female selection

#### Dynamic Rendering
Maps API response fields to UI:
- `fullName` → Nurse name
- `profileImage` → Nurse photo
- `subCategory` → Nurse specialty
- `experience` → Years of experience
- `about` → Brief description
- `pricings.perHour`, `pricings.perDay` → Pricing display
- `_id` → Link to detail page

#### Pagination
- Previous/Next arrow buttons
- Page number buttons
- Disabled states for boundary pages
- Smooth scroll to top on page change

#### User Experience
- Loading state with message
- Empty state when no nurses found
- Clear Filters button (appears only when filters are active)
- Automatic revert to all nurses when filters are cleared

---

### 3. NurseDetail Component (`src/pages/book-nurse/NurseDetail.jsx`)

**Key Features Implemented:**

#### Dynamic Data Fetching
- Extracts `nurseId` from URL using `useParams()`
- Fetches nurse details on component mount
- Redirects to `/book-nurse` if nurse not found

#### Nurse Information Display
Maps API fields to UI sections:
- `fullName` → Nurse name
- `subCategory` → Specialty/qualification
- `age` → Age display
- `gender` → Gender icon and text
- `experience` → Years of experience
- `about` → About section
- `specialised` → Specializations section
- `certificates` → Certifications list
- `tags` → Tag badges
- `statecity.city`, `statecity.state` → Location
- `serviceArea` → Service coverage area

#### Image Gallery
- Main profile image display
- Certificate images as thumbnails
- Click to change main image
- Fallback image if no profile image

#### Pricing & Booking
- Dynamic rental type selection (Hour/Day/Week/Month)
- Shows only available pricing options
- Visit time selection based on `availableVisitTimings`
- Days selector with +/- buttons
- Date picker with minimum date validation
- Real-time total calculation
- Security deposit display (if available)

#### Visit Timing
Dynamically renders visit time options based on API data:
- Morning (with time range)
- Afternoon (with time range)
- Evening (with time range)

---

### 4. Route Configuration (`src/mainroutes/MainRoute.jsx`)

Updated nurse detail route to accept dynamic ID:
```javascript
// Before
<Route path="/nurse-detail" element={<NurseDetail />} />

// After
<Route path="/nurse-detail/:nurseId" element={<NurseDetail />} />
```

---

## API Response Mapping

### Nurse List Response Fields Used:
```javascript
{
  "_id": "693fd2728c2fdb6eae1413d2",
  "fullName": "nirmala",
  "subCategory": "cardiologist121",
  "gender": "female",
  "age": "25",
  "experience": 4,
  "profileImage": "https://...",
  "about": "Experienced doctor for ICU support",
  "pricings": {
    "perHour": 100,
    "perDay": 1100,
    "perWeek": 5100,
    "perMonth": 18000,
    "securityDeposit": 2100
  },
  "statecity": {
    "state": "hydrabad",
    "city": "vijayawada"
  }
}
```

### Additional Fields Used in Detail Page:
- `certificates[]`: Array of certificate objects with `name` and `url`
- `availableVisitTimings`: Object with `morning`, `afternoon`, `evening` time ranges
- `tags[]`: Array of tag strings
- `serviceArea`: Service coverage area
- `specialised`: Specialization description

---

## Differences from Equipment Implementation

While following the same pattern, nurse pages have these unique features:

1. **Different Filter Fields**:
   - Equipment: subCategory, location, date, rentalDuration, priceRange
   - Nurse: subCategory, location, experience, gender

2. **Additional Nurse-Specific Fields**:
   - Visit timings selection
   - Gender display with icons
   - Age display
   - Certificates/certifications
   - Tags
   - Service area

3. **Pricing Structure**:
   - Equipment: Primarily per day/week/month
   - Nurse: Includes per hour option

4. **Image Handling**:
   - Equipment: profileImage + images array
   - Nurse: profileImage + certificates array (with URLs)

---

## Testing Checklist

- [ ] Nurse list page loads with API data
- [ ] Pagination works correctly
- [ ] Filters apply correctly (subCategory, location, experience, gender)
- [ ] Clear filters button works
- [ ] Clicking "Book Now" navigates to correct nurse detail page
- [ ] Nurse detail page fetches correct data by ID
- [ ] All nurse information displays correctly
- [ ] Image gallery works (profile + certificates)
- [ ] Pricing calculation works for all rental types
- [ ] Visit timing selection displays available times
- [ ] Date picker validation works
- [ ] Loading and error states display properly

---

## Notes

1. The API endpoint uses `/user/getallservices` for nurses (not `/user/getallnurses`)
2. The filter endpoint is `/user/servicefilters` (not `/user/nursefilters`)
3. Gender filter values should be lowercase: "male", "female"
4. Experience filter expects numeric values
5. The component handles missing/optional fields gracefully with fallbacks
