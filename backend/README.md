# AgriEasy Backend - README

## Quick Start

### Installation
```bash
npm install
```

### Configuration
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other config
```

### Run Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## Project Structure

- **models/**: MongoDB schemas for all entities
- **controllers/**: Business logic for each feature
- **routes/**: API endpoint definitions
- **middleware/**: Authentication, validation, error handling
- **utils/**: Helper functions for tokens, location, responses
- **server.js**: Express app setup and Socket.io configuration

## Key Features

### Authentication
- JWT-based authentication
- Role-based access control (farmer, buyer, transporter)
- Password hashing with bcryptjs

### Commodity Management
- List commodities with detailed specs
- Search with geolocation filtering
- Discount and pricing management

### Transactions
- Offer flow from buyer to farmer
- Negotiation support
- Vehicle allocation

### Billing
- Invoice generation after delivery
- Tax calculations (GSTIN)
- Payment tracking

### Real-time Features
- Socket.io for live notifications
- User-specific rooms for messages
- Broadcast events to relevant roles

## API Structure

All endpoints are prefixed with `/api/`

- `/auth` - Authentication (register, login)
- `/farmer` - Farmer operations
- `/buyer` - Buyer operations
- `/commodity` - Commodity listings
- `/vehicle` - Vehicle management
- `/transaction` - Business deals
- `/billing` - Invoicing

## Database

MongoDB with Mongoose ODM
- Indexes on frequently queried fields
- Geospatial indexes for location queries
- Discriminator pattern for role-based users

## Security

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- CORS configuration
- Error message sanitization

## Error Handling

All errors return JSON with:
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Socket.io Events

- `joinRoom` - User joins their role-specific room
- `farmerListCommodity` - Broadcast new commodity
- `sendOfferToFarmer` - Send offer notification
- `acceptOffer` - Accept offer notification
- `requestVehicle` - Vehicle request
- `vehicleAllocated` - Vehicle allocation notification

See server.js for complete list of events.
