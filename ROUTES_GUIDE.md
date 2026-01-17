# 🗺️ AgriEasy Frontend Routes & Navigation Guide

## Complete Application Routes

### Public Routes (No Authentication Required)

#### Home Page
- **Path**: `/`
- **File**: `HomePage.js`
- **Description**: Landing page with role selection (Farmer, Buyer, Transporter)
- **Features**: Hero section, feature showcase, CTA buttons

#### Authentication Routes
- **Path**: `/login`
- **File**: `LoginPage.js`
- **Description**: Login form for all users
- **Features**: Email/password login, error handling, redirect to register

- **Path**: `/register/:role`
- **File**: `RegisterPage.js`
- **Description**: Multi-step registration form
- **Roles**: farmer, buyer, transporter
- **Features**: 3-step process, role-specific fields, validation

#### Search Routes
- **Path**: `/search/commodities`
- **File**: `CommoditySearchPage.js`
- **Description**: Browse and filter commodities
- **Filters**: Type, city, price range, quality
- **Features**: Grid display, detailed cards, sort options

- **Path**: `/search/vehicles`
- **File**: `VehicleSearchPage.js`
- **Description**: Search for transport vehicles
- **Filters**: Type, state, max price/km, capacity
- **Features**: Vehicle cards, pricing, availability status

#### Detail Pages
- **Path**: `/commodity/:id`
- **File**: `CommodityDetailPage.js`
- **Description**: Full commodity details with farmer profile
- **Features**:
  - Complete commodity specifications
  - Farmer profile and ratings
  - Send offer form (for buyers)
  - Pricing with discounts
  - Storage conditions and shelf life

- **Path**: `/vehicle/:id`
- **File**: `VehicleDetailPage.js`
- **Description**: Full vehicle details with transporter profile
- **Features**:
  - Vehicle specifications and documents
  - Transporter profile and ratings
  - Real-time cost calculator
  - Booking form (for farmers)
  - Service area coverage

#### Billing Route
- **Path**: `/billing`
- **File**: `BillingPage.js`
- **Description**: View and manage invoices (for both roles)
- **Features**:
  - Invoice list with filters
  - Payment tracking and progress
  - Record payment form
  - Invoice details modal
  - Print invoice functionality

---

### Protected Routes (Authentication Required)

#### Farmer Routes

**Farmer Dashboard**
- **Path**: `/farmer`
- **File**: `pages/Farmer/FarmerDashboard.js`
- **Required Role**: farmer
- **Main Features**:
  - Overview with stats cards
  - Recent listings display
  - Links to sub-pages

**Farmer Overview Tab**
- **Path**: `/farmer` (default)
- **Features**:
  - Total active listings
  - Completed deals count
  - Total earnings display
  - Average earnings per deal
  - Recent commodity listings
  - Pending offers notification

**Farmer Offers Tab**
- **Path**: `/farmer/offers`
- **File**: `pages/Farmer/FarmerOffersPage.js`
- **Features**:
  - List of all offers received
  - Filter by status (All, Pending, Accepted, Rejected, Completed)
  - Offer cards with quick info
  - Detailed modal with:
    - Buyer information
    - Commodity details
    - Offer terms and conditions
    - Payment method
    - Timeline of offer
  - Actions: Accept offer, Reject offer
  - Statistics dashboard

**Farmer Listings Tab**
- **Path**: `/farmer/listings`
- **Status**: Coming Soon
- **Planned Features**:
  - All active listings
  - Edit/update listings
  - Delist commodities
  - View listing analytics
  - Price adjustments

**Farmer Transactions Tab**
- **Path**: `/farmer/transactions`
- **Status**: Coming Soon
- **Planned Features**:
  - All completed transactions
  - Transaction timeline
  - Payment tracking
  - Delivery confirmations
  - Rating and reviews

**Farmer Profile Tab**
- **Path**: `/farmer/profile`
- **Status**: Coming Soon
- **Planned Features**:
  - Edit profile information
  - Update farm details
  - Bank account information
  - Document uploads
  - Preferences and settings

**Add New Listing**
- **Path**: `/farmer/new-listing`
- **Status**: Coming Soon
- **Planned Features**:
  - Commodity form
  - Image uploads
  - Pricing setup
  - Quantity management
  - Payment conditions

---

#### Buyer Routes

**Buyer Dashboard**
- **Path**: `/buyer`
- **File**: `pages/Buyer/BuyerDashboard.js`
- **Required Role**: buyer
- **Features**: Overview dashboard (expandable)

**Buyer Offers Tab**
- **Path**: `/buyer/offers`
- **File**: `pages/Buyer/BuyerOffersPage.js`
- **Features**:
  - All offers sent to farmers
  - Filter by status (All, Pending, Accepted, Rejected, Completed)
  - Offer cards showing:
    - Commodity type and farmer
    - Quantity and amount
    - Current status
  - Detailed modal with:
    - Farmer contact information
    - Offer details and terms
    - Payment method
    - Timeline of offer
  - Actions: Cancel pending offers
  - Offer statistics

**Buyer Transactions Tab**
- **Path**: `/buyer/transactions`
- **Status**: Coming Soon
- **Planned Features**:
  - All active purchases
  - Delivery tracking
  - Transaction history
  - Received goods confirmation

**Buyer Purchases Tab**
- **Path**: `/buyer/purchases`
- **Status**: Coming Soon
- **Planned Features**:
  - Purchase history
  - Reorder from previous
  - Cost analytics
  - Top suppliers

**Buyer Profile Tab**
- **Path**: `/buyer/profile`
- **Status**: Coming Soon
- **Planned Features**:
  - Edit profile
  - Shop information
  - GSTIN details
  - Payment methods
  - Preferences

---

#### Transporter Routes

**Transporter Dashboard**
- **Path**: `/transporter`
- **File**: `pages/Transporter/TransporterDashboard.js`
- **Required Role**: transporter
- **Features**: Overview dashboard (expandable)

**Transporter Vehicles Tab**
- **Path**: `/transporter/vehicles`
- **Status**: Coming Soon
- **Planned Features**:
  - Registered vehicles list
  - Add new vehicle
  - Edit vehicle details
  - Vehicle availability
  - Service area management

**Transporter Trips Tab**
- **Path**: `/transporter/trips`
- **Status**: Coming Soon
- **Planned Features**:
  - Active trip tracking
  - Completed trips history
  - Trip earnings
  - Distance tracking
  - Route optimization

**Transporter Earnings Tab**
- **Path**: `/transporter/earnings`
- **Status**: Coming Soon
- **Planned Features**:
  - Total earnings display
  - Earnings breakdown by trip
  - Monthly analytics
  - Payment history

**Transporter Profile Tab**
- **Path**: `/transporter/profile`
- **Status**: Coming Soon
- **Planned Features**:
  - Edit profile
  - Company information
  - License details
  - Insurance information
  - Operating regions

---

## Navigation Flow Diagrams

### Farmer User Flow
```
Home
└─→ Register (Farmer)
    └─→ Login
        └─→ Farmer Dashboard
            ├─→ Overview (stats & recent listings)
            ├─→ My Listings (manage commodities)
            │   └─→ View Commodity Detail
            ├─→ Offers Received (view & manage)
            │   └─→ Offer Detail Modal
            │       ├─→ Accept Offer
            │       └─→ Reject Offer
            ├─→ Transactions (completed deals)
            ├─→ Profile (edit details)
            └─→ Search Buyers (find buyers)
                └─→ Buyer Profile
```

### Buyer User Flow
```
Home
└─→ Register (Buyer)
    └─→ Login
        └─→ Buyer Dashboard
            ├─→ Search Commodities
            │   └─→ Commodity Detail
            │       ├─→ View Farmer Profile
            │       └─→ Send Offer
            ├─→ My Offers (track sent offers)
            │   └─→ Offer Detail Modal
            │       └─→ Cancel Offer
            ├─→ Purchases (completed)
            ├─→ Profile (edit details)
            └─→ Billing
                └─→ Invoice Detail
                    └─→ Record Payment
```

### Transporter User Flow
```
Home
└─→ Register (Transporter)
    └─→ Login
        └─→ Transporter Dashboard
            ├─→ My Vehicles (manage fleet)
            ├─→ Active Trips (current jobs)
            ├─→ Earnings (revenue tracking)
            └─→ Profile (edit details)

Farmer can also:
└─→ Search Vehicles
    └─→ Vehicle Detail
        └─→ Book Vehicle
```

---

## API Integration Summary

### Routes & API Calls Made:

| Route | Component | API Endpoint | Method |
|-------|-----------|--------------|--------|
| `/commodity/:id` | CommodityDetailPage | `/commodity/:id` | GET |
| `/commodity/:id` | CommodityDetailPage | `/transaction/send-offer` | POST |
| `/vehicle/:id` | VehicleDetailPage | `/vehicle/:id` | GET |
| `/vehicle/:id` | VehicleDetailPage | `/transaction/request-vehicle` | POST |
| `/farmer/offers` | FarmerOffersPage | `/transaction/offers` | GET |
| `/farmer/offers` | FarmerOffersPage | `/transaction/:id/accept` | POST |
| `/farmer/offers` | FarmerOffersPage | `/transaction/:id/reject` | POST |
| `/buyer/offers` | BuyerOffersPage | `/transaction/buyer-offers` | GET |
| `/buyer/offers` | BuyerOffersPage | `/transaction/:id/cancel` | POST |
| `/billing` | BillingPage | `/billing/buyer/list` OR `/billing/farmer/list` | GET |
| `/billing` | BillingPage | `/billing/:id` | GET |
| `/billing` | BillingPage | `/billing/:id/payment` | PUT |

---

## Authentication & Authorization

### Protected Route Middleware:
```javascript
<ProtectedRoute requiredRole="farmer">
  <FarmerDashboard />
</ProtectedRoute>
```

### Roles and Permissions:
- **farmer**: Can view/create commodities, receive offers, arrange transport, track earnings
- **buyer**: Can search commodities, send offers, manage purchases, track invoices
- **transporter**: Can register vehicles, receive transport requests, track trips, manage earnings

### Token Management:
- JWT stored in localStorage
- Auto-injected in API headers
- Auto-logout on token expiration
- Redirect to login on 401

---

## Key Navigation Features:

### Sidebar Navigation
- Persistent on dashboard pages
- Active route highlighting
- Offer badge showing unread count
- Quick logout button

### Breadcrumb Navigation
- Back buttons on detail pages
- Quick navigation links
- Clear page hierarchy

### Search & Filter
- Filter by status on offer/billing pages
- Sort options on list pages
- Real-time search on commodity/vehicle pages

### Modal Dialogs
- Non-disruptive detail views
- Click-outside to close
- Smooth animations
- Print functionality

---

## Best Practices Used:

✅ Logical route organization by role
✅ Protected routes with role-based access
✅ Clear separation of concerns
✅ Consistent naming conventions
✅ Breadcrumb navigation
✅ Modal dialogs for details
✅ Filter and sort capabilities
✅ Loading states on all routes
✅ Error handling on all API calls
✅ Mobile-responsive navigation

---

## Future Route Expansions:

Planned routes for Phase 2:
- `/farmer/new-listing` - Create commodity
- `/buyer/transactions` - Purchase history
- `/transporter/vehicles` - Vehicle management
- `/admin/dashboard` - Admin panel
- `/chat/:userId` - Direct messaging
- `/analytics` - Performance dashboards
- `/settings` - User preferences
- `/help` - FAQs and support

---

**Total Routes**: 25+ (implemented: 12, coming soon: 13+)
**Status**: Fully routed and ready for feature implementation
