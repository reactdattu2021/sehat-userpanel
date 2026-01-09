# Nurse API Response Structure - IMPORTANT

## API Response Differences

### ⚠️ CRITICAL: Different Response Structures

The nurse APIs have **different response structures** for list vs detail endpoints:

---

## 1. List Endpoint (getAllNursesApi / getNurseFiltersApi)

**Endpoint**: `GET /user/getallservices`

**Response Structure**:
```json
{
  "success": true,
  "total": 3,
  "totalPages": 1,
  "currentPage": 1,
  "limit": 10,
  "data": [
    {
      "_id": "693fd2728c2fdb6eae1413d2",
      "category": "nurse",
      "subCategory": "cardiologist121",
      "fullName": "nirmala",
      "gender": "female",
      "age": "25",
      "experience": 4,
      "serviceArea": "1",
      "phone": "9876543222",
      "email": "nirmala@mail.com",
      "statecity": {
        "state": "hydrabad",
        "city": "vijayawada"
      },
      "profileImage": "https://...",
      "certificates": [...],
      "tags": ["heart", "senior", "english"],
      "availableVisitTimings": {
        "morning": "06:00-09:00",
        "evening": "05:00-08:00"
      },
      "about": "Experienced doctor for ICU support",
      "pricings": {
        "perHour": 100,
        "perDay": 1100,
        "perWeek": 5100,
        "perMonth": 18000,
        "shippingCost": 51,
        "taxPercentage": 1,
        "securityDeposit": 2100
      }
    }
  ]
}
```

**Key Points**:
- ✅ Data is in `response.data.data` array
- ✅ Each nurse object includes `pricings` directly
- ✅ Pagination info at root level

---

## 2. Detail Endpoint (getNurseByIdApi)

**Endpoint**: `GET /user/getservice/{nurseId}`

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "service": {
      "statecity": {
        "state": "Telangana",
        "city": "Hyderabad"
      },
      "availableVisitTimings": {
        "morning": "06:00-09:00",
        "evening": "05:00-08:00"
      },
      "_id": "69451ce4c7b5e265692f5b45",
      "category": "nurse",
      "subCategory": "cardiacnurse",
      "fullName": "Dattu Kumar",
      "gender": "male",
      "age": "28",
      "experience": 2,
      "serviceArea": "JNTU",
      "phone": "8374831031",
      "email": "mukeshpabolu123@gmail.com",
      "profileImage": null,
      "certificates": [
        {
          "name": "tradelicence.jpg",
          "url": "https://...",
          "_id": "69451ce4c7b5e265692f5b46"
        }
      ],
      "approvedByAdmin": true,
      "active": true,
      "tags": ["heart", "senior", "english"],
      "about": "Experienced doctor for ICU support",
      "specialised": "{\r\n  Post-Surgery Care – Monitoring recovery, dressing wounds, mobility support,\r\n  Elderly Care – Daily assistance, vitals monitoring, and companionship\r\n}",
      "status": "available",
      "bookedDates": []
    },
    "pricings": {
      "perHour": 200,
      "perDay": 1000,
      "perWeek": 5000,
      "perMonth": 18000
    }
  }
}
```

**Key Points**:
- ⚠️ Data is **nested** under `response.data.data.service`
- ⚠️ Pricings are **separate** at `response.data.data.pricings`
- ⚠️ Must **combine** service and pricings data

---

## Code Implementation

### BookNurse.jsx (List)
```javascript
// ✅ CORRECT - Direct access to data array
if (response.data.success) {
  setNurses(response.data.data);  // Array of nurses with pricings included
  setTotalPages(response.data.totalPages);
  setTotal(response.data.total);
}
```

### NurseDetail.jsx (Detail)
```javascript
// ✅ CORRECT - Combine service and pricings
if (response.data.success) {
  const serviceData = response.data.data.service;
  const pricingsData = response.data.data.pricings;
  
  // Combine into single object
  const nurseData = {
    ...serviceData,
    pricings: pricingsData
  };
  
  setNurse(nurseData);
  setSelectedImg(serviceData.profileImage || "/assets/BookANurseImages/doctor img (10).png");
}
```

---

## Field Mapping Reference

### Common Fields (Both Endpoints)
- `_id`: Unique identifier
- `fullName`: Nurse's full name
- `subCategory`: Nurse category/specialty
- `gender`: "male" or "female"
- `age`: Age as string
- `experience`: Years of experience (number)
- `serviceArea`: Service coverage area
- `phone`: Contact number
- `email`: Email address
- `statecity.state`: State name
- `statecity.city`: City name
- `profileImage`: Profile image URL (can be null)
- `certificates[]`: Array of certificate objects
  - `name`: Certificate filename
  - `url`: Certificate image URL
  - `_id`: Certificate ID
- `tags[]`: Array of tag strings
- `availableVisitTimings.morning`: Morning time range
- `availableVisitTimings.evening`: Evening time range
- `about`: About/description text
- `status`: Availability status

### Detail-Only Fields
- `specialised`: Specialization description (may contain JSON-like string)
- `approvedByAdmin`: Boolean
- `active`: Boolean
- `bookedDates[]`: Array of booked dates
- `availableFrom`: Availability start date (can be null)
- `availableTo`: Availability end date (can be null)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Pricing Fields (List: nested, Detail: separate)
- `pricings.perHour`: Hourly rate
- `pricings.perDay`: Daily rate
- `pricings.perWeek`: Weekly rate
- `pricings.perMonth`: Monthly rate
- `pricings.securityDeposit`: Security deposit amount (list only)
- `pricings.shippingCost`: Shipping cost (list only)
- `pricings.taxPercentage`: Tax percentage (list only)

---

## Fallback Handling

### Profile Image
```javascript
// Use fallback if profileImage is null
const imageUrl = nurse.profileImage || "/assets/BookANurseImages/doctor img (10).png";
```

### Certificates
```javascript
// Build image array with fallback
const allImages = nurse.certificates && nurse.certificates.length > 0
  ? [nurse.profileImage, ...nurse.certificates.map(cert => cert.url)].filter(Boolean)
  : [nurse.profileImage].filter(Boolean);
```

### Optional Fields
```javascript
// Check before rendering
{nurse.specialised && (
  <div>
    <h1>Specializations</h1>
    <p>{nurse.specialised}</p>
  </div>
)}

{nurse.pricings?.securityDeposit && (
  <p>Security Deposit: ₹{nurse.pricings.securityDeposit}</p>
)}
```

---

## Testing Checklist

- [x] List page loads with correct nurse data
- [x] Pricings display correctly in list view
- [x] Detail page fetches and parses nested structure correctly
- [x] Service data and pricings are properly combined
- [x] Null profileImage handled with fallback
- [x] Certificates display correctly
- [x] All optional fields have conditional rendering
- [x] Visit timings display when available
- [x] Tags render as badges
- [x] Location information displays correctly

---

## Common Issues & Solutions

### Issue: "Cannot read property 'perHour' of undefined"
**Cause**: Pricings not properly extracted from detail response
**Solution**: Use the nested extraction pattern shown above

### Issue: Profile image not displaying
**Cause**: `profileImage` is `null` in API response
**Solution**: Use fallback image: `nurse.profileImage || "/assets/BookANurseImages/doctor img (10).png"`

### Issue: Certificates not showing
**Cause**: Accessing wrong property or null check missing
**Solution**: Use `nurse.certificates && nurse.certificates.length > 0` check

### Issue: Specialised field shows raw JSON string
**Cause**: Backend returns JSON-like string instead of parsed object
**Solution**: Display as-is or parse if needed (currently displaying as text)
