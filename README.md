# 🌾 AgriEasy.com - Complete Documentation

## Project Overview

**AgriEasy** is a full-featured agricultural e-commerce platform that revolutionizes the way farmers, buyers, and transporters connect. It eliminates middlemen, ensures fair pricing, and provides integrated logistics solutions.

## 🎯 Key Features

### For Farmers
- **List Commodities**: Post crops with detailed specifications, pricing, and conditions
- **Find Buyers**: Browse buyers in your region with advanced filtering
- **Track Offers**: Receive and manage offers from interested buyers
- **Arrange Transport**: Select from available vehicles and transporters
- **Track Earnings**: Monitor sales and earnings in real-time
- **Digital Transactions**: Complete billing and payment records

### For Buyers
- **Search Products**: Find quality commodities from farmers near you
- **Smart Filtering**: Filter by commodity type, price, quality, distance
- **Direct Negotiation**: Negotiate prices directly with farmers
- **Inventory Management**: List buying requirements and manage purchases
- **Digital Invoicing**: Generate and manage GST-compliant invoices
- **Multiple Payments**: Cash, Cheque, UPI, Bank Transfer options

### For Transporters
- **Register Vehicles**: List vehicles with detailed specifications
- **Set Pricing**: Define rates per kilometer for different routes
- **Get Requests**: Receive transport requests from farmers
- **Track Trips**: Monitor active trips and earnings
- **Flexible Service**: Serve multiple regions and commodity types

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io for live notifications
- **Validation**: Express-validator
- **Security**: bcryptjs for password hashing

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Form Management**: React Hook Form
- **Styling**: Tailwind CSS + CSS Modules
- **Notifications**: React Toastify
- **Charts**: Recharts
- **Icons**: React Icons
- **Maps**: Mapbox GL / React Map GL

## 📁 Project Structure

```
AgriEasy/
├── backend/                    # Node.js backend
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js             # Base user model
│   │   ├── Farmer.js           # Farmer discriminator
│   │   ├── Buyer.js            # Buyer discriminator
│   │   ├── Transporter.js      # Transporter discriminator
│   │   ├── CommodityListing.js # Product listings
│   │   ├── Vehicle.js          # Transport vehicles
│   │   ├── Transaction.js      # Business deals
│   │   └── Billing.js          # Invoices
│   │
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── farmerController.js
│   │   ├── buyerController.js
│   │   ├── commodityController.js
│   │   ├── vehicleController.js
│   │   ├── transactionController.js
│   │   └── billingController.js
│   │
│   ├── routes/                 # API endpoints
│   │   ├── authRoutes.js
│   │   ├── farmerRoutes.js
│   │   ├── buyerRoutes.js
│   │   ├── commodityRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── billingRoutes.js
│   │   └── searchRoutes.js
│   │
│   ├── middleware/             # Custom middleware
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── validationMiddleware.js
│   │   └── errorHandler.js
│   │
│   ├── utils/                  # Helper functions
│   │   ├── tokenUtils.js       # JWT operations
│   │   ├── locationUtils.js    # Geolocation
│   │   └── responseUtils.js    # Response formatting
│   │
│   ├── server.js               # Entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── pages/              # Page components
    │   │   ├── HomePage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── Farmer/
    │   │   ├── Buyer/
    │   │   ├── Transporter/
    │   │   ├── CommoditySearchPage.js
    │   │   └── VehicleSearchPage.js
    │   │
    │   ├── services/           # API & Socket services
    │   │   ├── apiService.js
    │   │   └── socketService.js
    │   │
    │   ├── context/            # React Context
    │   │   └── AuthContext.js
    │   │
    │   ├── styles/             # Global styles
    │   ├── App.js              # Main app component
    │   ├── config.js           # Configuration
    │   └── index.js
    │
    ├── package.json
    └── public/
        └── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone and navigate**:
```bash
cd AgriEasy/backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

5. **Run server**:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**:
```bash
cd AgriEasy/frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create .env file**:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. **Start development server**:
```bash
npm start
```

App opens at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

**POST** `/api/auth/register/farmer`
- Register new farmer
- Required: firstName, lastName, email, phone, password, address, city, state, pincode, farmName, landArea, farmingType

**POST** `/api/auth/register/buyer`
- Register new buyer
- Required: firstName, lastName, email, phone, password, address, city, state, pincode, shopName, businessType, gstin

**POST** `/api/auth/register/transporter`
- Register new transporter
- Required: firstName, lastName, email, phone, password, address, city, state, pincode, transporterType, operatingRegions

**POST** `/api/auth/login`
- Login user
- Body: { email, password }
- Returns: { token, user }

**GET** `/api/auth/me`
- Get current user profile
- Headers: Authorization: Bearer {token}

### Commodity Endpoints

**GET** `/api/commodity/search`
- Search commodities with filters
- Query params: commodityType, city, maxDistance, minPrice, maxPrice, quality, page, limit

**GET** `/api/commodity/:listingId`
- Get commodity details

**POST** `/api/commodity/create`
- Create new listing (Farmer only)
- Auth required

**PUT** `/api/commodity/:listingId`
- Update listing (Farmer only)
- Auth required

**DELETE** `/api/commodity/:listingId`
- Delist commodity (Farmer only)
- Auth required

### Vehicle Endpoints

**GET** `/api/vehicle/search`
- Search vehicles
- Query: vehicleType, state, minCapacity, maxPrice, page, limit

**GET** `/api/vehicle/:vehicleId`
- Get vehicle details

**POST** `/api/vehicle/register`
- Register vehicle (Transporter only)
- Auth required

**PUT** `/api/vehicle/:vehicleId`
- Update vehicle (Transporter only)
- Auth required

**PATCH** `/api/vehicle/:vehicleId/availability`
- Update vehicle availability
- Auth required

### Transaction Endpoints

**GET** `/api/transaction/offers`
- Get farmer's offers (Farmer only)
- Auth required

**POST** `/api/transaction/:transactionId/accept`
- Accept offer (Farmer only)
- Auth required

**POST** `/api/transaction/:transactionId/reject`
- Reject offer (Farmer only)
- Auth required

**POST** `/api/transaction/:transactionId/request-vehicle`
- Request vehicle (Farmer only)
- Body: { vehicleId }
- Auth required

### Billing Endpoints

**POST** `/api/billing/create`
- Create invoice (Buyer only)
- Auth required

**GET** `/api/billing/:billingId`
- Get invoice details
- Auth required

**PUT** `/api/billing/:billingId/payment`
- Record payment (Buyer only)
- Auth required

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  userId: ObjectId,
  email: String,
  role: 'farmer' | 'buyer' | 'transporter',
  iat: Timestamp,
  exp: Timestamp
}
```

### Role-Based Access Control
- **Farmer**: Can list commodities, receive offers, arrange transport
- **Buyer**: Can search commodities, send offers, create invoices
- **Transporter**: Can register vehicles, receive transport requests

### Authorization Middleware
```javascript
// Check authentication
authMiddleware

// Check specific role
farmersOnly  // For farmer routes
buyersOnly   // For buyer routes
transportersOnly  // For transporter routes
```

## 🗄️ Database Schema

### User (Base)
- firstName, lastName
- email, phone, password (hashed)
- address, city, state, pincode
- location (GeoJSON for distance queries)
- role (farmer, buyer, transporter)
- rating, isActive, createdAt, updatedAt

### Farmer (extends User)
- farmName, landArea, farmingType
- bankDetails, aadharNumber
- totalListings, completedDeals, totalEarnings

### Buyer (extends User)
- shopName, businessType, gstin
- paymentMethods, bankDetails
- commoditiesBuy array

### Transporter (extends User)
- transporterType
- licenseNumber, insurance
- totalTrips, totalEarnings
- vehicleIds array

### CommodityListing
- farmerId (ref to Farmer)
- commodityType, quality
- availableQuantity, minOrderQuantity
- pricePerUnit, discount, discountedPrice
- paymentConditions (cash, cheque, UPI)
- pickupLocation (GeoJSON)
- storageConditions, shelfLife
- images array, views count
- isActive, delisted, delistedAt

### Vehicle
- transporterId (ref to Transporter)
- vehicleType, registration
- capacity (weight, volume)
- pricePerKilometer
- serviceArea (states, cities)
- insurance, permits
- currentLocation (GeoJSON)
- isAvailable, totalTrips, totalEarnings

### Transaction
- farmerId, buyerId
- commodityListingId
- agreedQuantity, totalPrice
- paymentMethod, paymentStatus
- vehicleId, transporterId
- status (Offer Sent → Completed)
- pickupLocation, deliveryLocation
- billingId, estimatedDistance

### Billing
- transactionId (unique)
- farmerId, buyerId
- actualWeightReceived
- subTotal, taxes, deductions, totalAmount
- paymentStatus (Unpaid → Paid)
- invoiceNumber (auto-generated)
- termsAndConditions, notes

## 🔄 Business Flow

### 1. Farmer Lists Commodity
```
Farmer registers → Farmer lists commodity → Commodity visible to buyers
```

### 2. Buyer Sends Offer
```
Buyer searches → Finds commodity → Sends offer → Farmer receives notification
```

### 3. Offer Negotiation
```
Farmer reviews offer → Accept/Reject → Both parties agree on terms
```

### 4. Transport Arrangement
```
Farmer needs transport → Views available vehicles → Selects vehicle
→ Transporter allocated → Real-time tracking starts
```

### 5. Delivery & Billing
```
Goods delivered → Buyer weighs commodity → Creates invoice
→ Records payment → Transaction completed
```

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Works on desktop, tablet, mobile
- Adaptive layouts and navigation

### User Experience
- Role-based dashboards
- Real-time notifications (Socket.io)
- Search with advanced filters
- Location-based recommendations
- One-click commodity listing
- Digital invoice generation

### Visual Design
- Green theme (agricultural identity)
- Clean, modern UI
- Intuitive navigation
- Professional styling
- Accessibility-friendly

## 🔗 Real-Time Features

### Socket.io Events
- Farmer lists new commodity → Notify buyers
- Buyer sends offer → Notify farmer
- Farmer accepts offer → Notify buyer
- Vehicle allocated → Notify farmer
- Billing created → Notify both parties
- Payment received → Notify farmer

## 🛡️ Security Features

### Password Security
- bcryptjs hashing
- 6+ character requirement
- Never returned in API responses

### Token Security
- JWT with expiration
- Stored in localStorage
- Sent in Authorization header
- Auto-logout on expiration

### Data Validation
- Express-validator for all inputs
- Email format validation
- Phone number format (10 digits)
- GSTIN format validation
- Pincode format (6 digits)

### Database Security
- Connection pooling
- Prepared statements (Mongoose)
- Input sanitization
- CORS enabled
- Error message sanitization

## 📊 Analytics & Reporting

### Farmer Analytics
- Total earnings by period
- Number of completed deals
- Average price per commodity
- Popular commodities
- Buyer preferences

### Buyer Analytics
- Total purchases & spent
- Supplier statistics
- Average prices paid
- Commodity trends

### Transporter Analytics
- Total earnings
- Number of trips
- Average trip distance
- Popular routes
- Vehicle utilization

## 🚀 Deployment

### Backend Deployment (Heroku/AWS)
```bash
# Heroku
heroku login
heroku create agrieasy-backend
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the build folder
```

### Database
- Use MongoDB Atlas for cloud database
- Configure connection string in .env

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrieasy
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GOOGLE_MAPS_API_KEY=your-maps-api-key
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

## 🧪 Testing

### Unit Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### API Testing
- Postman collection included
- Test all endpoints before deployment

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check MongoDB is running
- Verify connection string
- Check network access (MongoDB Atlas)

**CORS Errors**
- Verify FRONTEND_URL in .env
- Check CORS middleware is configured

**JWT Token Errors**
- Verify JWT_SECRET
- Check token expiration
- Clear localStorage if issues persist

**Socket.io Connection Issues**
- Ensure Socket.io is initialized
- Check SOCKET_URL configuration
- Verify firewall settings

## 📞 Support & Contact

For issues, suggestions, or contributions:
- Email: support@agrieasy.com
- GitHub: https://github.com/agrieasy
- Documentation: https://docs.agrieasy.com

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with Node.js, Express, MongoDB, React
- Uses geolocation for distance-based filtering
- Real-time notifications with Socket.io
- Secure JWT authentication

---

**AgriEasy** - Connecting Agriculture, Creating Opportunities 🌾🚜🏪🚛
