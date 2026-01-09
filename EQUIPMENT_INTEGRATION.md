# Equipment Integration - Simple Guide

## ✅ **What's Done**

- ✅ API function added to `src/apis/authapis.js`
- ✅ Function: `getAllEquipmentsApi(page, limit)`
- ✅ Endpoint: `GET /Sehatmitra/user/getallequipment?page=1&limit=10`

---

## 🎯 **3 Simple Steps to Integrate**

### **Step 1: Update Route (1 minute)**

**File:** `src/mainroutes/MainRoute.jsx`

**Find line 35 and change:**
```jsx
// BEFORE
<Route path="/equipment-detail" element={<EquipmentDetail />} />

// AFTER
<Route path="/equipment/:equipmentId" element={<EquipmentDetail />} />
```

---

### **Step 2: Update Equipment List Page (10 minutes)**

**File:** `src/pages/equipments/Equipment.jsx`

**Add these imports at the top:**
```jsx
import { useState, useEffect } from "react";
import { getAllEquipmentsApi } from "../../apis/authapis";
```

**Add state after component declaration (around line 8-9):**
```jsx
const Equipment = () => {
  const selectRef = useRef(null);
  
  // Add these state variables
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
```

**Add useEffect to fetch data (after state declarations):**
```jsx
  // Fetch equipments on mount and page change
  useEffect(() => {
    fetchEquipments(currentPage);
  }, [currentPage]);

  const fetchEquipments = async (page) => {
    try {
      setLoading(true);
      const response = await getAllEquipmentsApi(page, limit);
      
      if (response.data.success) {
        setEquipments(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching equipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
```

**Update the equipment cards section (around line 138):**

**Change from:**
```jsx
{Equipments.map((data, index) => (
```

**To:**
```jsx
{loading ? (
  <div className="flex justify-center items-center py-20">
    <div className="text-xl font-semibold text-[#34658C]">Loading...</div>
  </div>
) : equipments.length === 0 ? (
  <div className="flex justify-center items-center py-20">
    <div className="text-xl font-semibold text-gray-500">No equipments found</div>
  </div>
) : (
  equipments.map((equipment) => (
```

**Update the equipment card content to use API data:**
```jsx
<div
  key={equipment._id}  // Change from data.id to equipment._id
  className="p-4 rounded-[16px]"
  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
>
  <div className="grid grid-cols-12 md:grid-cols-12 gap-6">
    <div className="col-span-12 md:col-span-5 rounded-[12px] flex justify-center md:block">
      <img
        src={equipment.profileImage}  // Change from data.image
        alt={equipment.equipmentName}
        className="rounded-[12px] w-[200px] h-[200px] object-cover"
      />
    </div>
    <div className="col-span-12 md:col-span-7">
      <div className="flex flex-col justify-center h-full gap-[6px]">
        <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] text-[#34658C] font-semibold">
          {equipment.equipmentName}  {/* Change from data.name */}
        </h1>
        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
          {equipment.description}  {/* Change from data.description */}
        </p>
        <p className="text-[12px] text-gray-600">
          {equipment.brand} • {equipment.model}
        </p>
        <div>
          <p className="text-[14px] leading-[22px] tracking-[0.56px] font-semibold">
            Rental Price:{" "}
            <span className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              ₹{equipment.pricings.perDay}/day | ₹{equipment.pricings.perWeek}/week
            </span>
          </p>
          <div className="flex gap-2 mt-[6px]">
            <button className="bg-[#34658C] text-white px-4 md:px-8 py-2 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold font-outfit">
              Add To Cart
            </button>
            <Link to={`/equipment/${equipment._id}`}>  {/* Change from /equipment-detail */}
              <button className="bg-[#A2CD48] text-white px-4 md:px-8 py-2 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold font-outfit">
                Rent Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
))  // Close the map
)}  // Close the ternary
```

**Add pagination UI after the equipment cards (before the FAQ section):**
```jsx
{/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-4 mt-10">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-lg font-semibold ${
        currentPage === 1
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-[#34658C] text-white hover:bg-[#2a5270]'
      }`}
    >
      Previous
    </button>
    
    <div className="flex gap-2">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            currentPage === index + 1
              ? 'bg-[#A2CD48] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-lg font-semibold ${
        currentPage === totalPages
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-[#34658C] text-white hover:bg-[#2a5270]'
      }`}
    >
      Next
    </button>
  </div>
)}

{/* Results Info */}
<div className="text-center mt-4 text-gray-600">
  Showing {equipments.length} of {total} equipments (Page {currentPage} of {totalPages})
</div>
```

---

### **Step 3: Update Equipment Detail Page (Will do later)**

**We'll update this when you provide the single equipment API endpoint.**

For now, just update the route as mentioned in Step 1.

---

## 🧪 **Test Equipment List**

1. Go to `http://localhost:5173/equipments`
2. Should see equipments loading from API
3. Check pagination appears if you have more than 10 equipments
4. Click "Rent Now" - URL should change to `/equipment/{id}`

---

## 📊 **Backend Response Structure**

```json
{
  "success": true,
  "total": 2,
  "totalPages": 1,
  "currentPage": 1,
  "limit": 10,
  "data": [
    {
      "_id": "693bc9039005d5babc9836e3",
      "equipmentName": "chair",
      "brand": "super",
      "model": "sss1235",
      "description": "using to all",
      "profileImage": "https://...",
      "images": ["https://..."],
      "pricings": {
        "perDay": 501,
        "perWeek": 3001,
        "perMonth": 10001,
        "shippingCost": 61,
        "securityDeposit": 1001
      }
    }
  ]
}
```

---

## 🔑 **Key Changes Summary**

| What | From | To |
|------|------|-----|
| Data source | `Equipments` (static) | `equipments` (API) |
| Equipment ID | `data.id` | `equipment._id` |
| Equipment name | `data.name` | `equipment.equipmentName` |
| Image | `data.image` | `equipment.profileImage` |
| Price | `data.price` | `equipment.pricings.perDay` |
| Link | `/equipment-detail` | `/equipment/${equipment._id}` |

---

## ✅ **Checklist**

- [ ] Step 1: Route updated in MainRoute.jsx
- [ ] Step 2: Equipment.jsx updated with API integration
- [ ] Test: Equipment list loads from API
- [ ] Test: Pagination works
- [ ] Test: Clicking "Rent Now" navigates with ID in URL
- [ ] Wait for single equipment API to complete Step 3

---

## 🚀 **Next**

Once you provide the single equipment API endpoint, I'll help you update the EquipmentDetail.jsx page to fetch and display individual equipment details.

---

**Time to implement:** ~15 minutes  
**Difficulty:** Easy  
**Status:** Equipment list integration ready, detail page pending API endpoint
