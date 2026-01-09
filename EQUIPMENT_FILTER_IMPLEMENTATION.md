# Equipment Filter Implementation

## Overview
This document explains the dynamic filter implementation for the Equipment page that allows users to search and filter equipment based on multiple criteria.

## Features Implemented

### 1. **Dynamic Filter API** (`authapis.js`)
Added `getEquipmentFiltersApi()` function that:
- Accepts a filters object with optional parameters
- Dynamically constructs query parameters based on provided values
- Only includes non-empty filter values in the API request
- Supports pagination with page and limit parameters

**Supported Filter Parameters:**
- `subCategory` - Equipment type (e.g., Wheelchair, Suction Machine)
- `location` - Location (city) - frontend field name, sent as `city` to backend
- `date` - Booking date
- `rentalDuration` - Rental period (perDay, perWeek, perMonth)
- `priceRange` - Maximum price filter

### 2. **Filter State Management** (`Equipment.jsx`)
Implemented comprehensive state management:
```javascript
const [filters, setFilters] = useState({
  subCategory: "",
  location: "",
  date: "",
  rentalDuration: "",
  priceRange: ""
});
const [isFilterActive, setIsFilterActive] = useState(false);
```

### 3. **Smart API Switching**
The `fetchEquipments()` function intelligently switches between:
- **Regular API** (`getAllEquipmentsApi`) - When no filters are active
- **Filter API** (`getEquipmentFiltersApi`) - When user has applied filters

### 4. **Controlled Form Inputs**
All filter inputs are now controlled components:
- **Equipment Dropdown** - Select equipment subcategory
- **Location Input** - Enter city name (single field for better UX)
- **Date Picker** - Select booking date
- **Rental Duration** - Choose rental period (perDay/perWeek/perMonth)
- **Price Range** - Select maximum price

### 5. **User Actions**
- **Search Button** - Triggers filter API call with current filter values
- **Clear Filters Button** - Resets all filters and returns to unfiltered view
- **Pagination** - Works seamlessly with both filtered and unfiltered results

## How It Works

### User Flow:
1. User selects one or more filter criteria (e.g., Wheelchair + State: ts + City: thirumala)
2. User clicks "Search Providers" button
3. System sends API request with only the filled filter parameters
4. Backend returns filtered results
5. UI displays filtered equipment with pagination
6. User can clear filters to return to all equipment

### Example API Call:
```javascript
// When user types: thirumala in location field
GET /user/equipmentfilters?page=1&limit=10&subCategory=%20Wheelchair&city=thirumala

// Response:
{
  "success": true,
  "total": 1,
  "totalPages": 1,
  "currentPage": 1,
  "limit": 10,
  "data": [...]
}
```

## Key Functions

### `handleFilterChange(field, value)`
Updates individual filter fields in state when user changes input values.

### `handleSearch()`
- Sets `isFilterActive` to true
- Resets to page 1
- Triggers `fetchEquipments()` which uses the filter API

### `handleClearFilters()`
- Resets all filter values to empty strings
- Sets `isFilterActive` to false
- Resets to page 1
- Triggers `fetchEquipments()` which uses the regular API

### `fetchEquipments(page)`
- Checks if filters are active
- Calls appropriate API (filtered or unfiltered)
- Updates equipment list and pagination state

## UI Enhancements
- Single Location input field for better UX - users type city name
- Location field is sent to backend as `city` parameter
- Clear Filters button appears only when filters are active
- Updated rental duration options to match backend expectations (perDay, perWeek, perMonth)
- Price range options with rupee symbol
- Maintained responsive design across all screen sizes

## Backend Integration
The implementation matches the backend API structure:
- Endpoint: `/user/equipmentfilters`
- Method: GET
- Query Parameters: All filter fields are optional
- Response: Standard pagination response with filtered data

## Testing Checklist
- [ ] Filter by equipment subcategory only
- [ ] Filter by location (state + city)
- [ ] Filter by date
- [ ] Filter by rental duration
- [ ] Filter by price range
- [ ] Combine multiple filters
- [ ] Clear filters returns to all equipment
- [ ] Pagination works with filtered results
- [ ] Empty filter values are not sent to backend
