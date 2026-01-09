# Pricing Data Structure Issue

## Problem
The filtered API response has a different data structure than the regular API response.

## Backend Response Structure (from your example)

### Filtered API Response:
```json
{
  "success": true,
  "total": 1,
  "totalPages": 1,
  "currentPage": 1,
  "limit": 10,
  "data": [
    {
      "statecity": {
        "state": "ts",
        "city": "thirumala"
      },
      "_id": "695e12aedafc3c27db3248c5",
      "category": "equipment",
      "subCategory": " Wheelchair",
      "equipmentName": "Motorized Power Wheelchair",
      "description": "...",
      "advantages": "Single Flow",
      "profileImage": "...",
      "images": [],
      "approvedByAdmin": true,
      "tags": ["Wheelchair"],
      "features": [
        {
          "key": "Capacity",
          "value": "2000ml",
          "_id": "695e12aedafc3c27db3248c6"
        }
      ],
      "status": "available",
      "bookedDates": [],
      "createdAt": "2026-01-07T08:00:46.209Z",
      "updatedAt": "2026-01-07T09:30:00.266Z",
      "__v": 0
    }
  ]
}
```

**NOTICE:** No `pricings` object in the filtered response!

### Expected Regular API Response:
```json
{
  "data": [
    {
      "_id": "...",
      "equipmentName": "...",
      "pricings": {
        "perDay": 100,
        "perWeek": 500,
        "perMonth": 1500
      }
    }
  ]
}
```

## Solution Applied

### 1. Added Optional Chaining
```javascript
{equipment.pricings?.perDay ? (
  <>₹{equipment.pricings.perDay}/day | ₹{equipment.pricings.perWeek}/week</>
) : (
  "Contact for pricing"
)}
```

### 2. Added Console Logging
To help debug and see the actual structure:
```javascript
console.log('API Response:', response.data);
console.log('Equipment data sample:', response.data.data[0]);
```

## Next Steps

**Please check your browser console** to see what data structure is being returned. Then we can:

1. **Option A:** Update the backend filter API to include `pricings` object
2. **Option B:** Update the frontend to handle both structures
3. **Option C:** Extract pricing from features array if that's where it's stored

## Temporary Fix
The code now shows "Contact for pricing" when `pricings` object is missing, preventing the crash.
