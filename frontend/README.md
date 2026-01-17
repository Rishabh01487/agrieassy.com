# AgriEasy Frontend - README

## Quick Start

### Installation
```bash
npm install
```

### Configuration
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Run Development Server
```bash
npm start
```

App opens at `http://localhost:3000`

## Project Structure

- **pages/**: Full page components (Home, Login, Register, Dashboards)
- **components/**: Reusable React components
- **services/**: API service with Axios, Socket.io service
- **context/**: AuthContext for global state management
- **styles/**: CSS files for styling
- **config.js**: API endpoints and configuration

## Key Components

### Pages
- **HomePage**: Landing page with role selection
- **LoginPage**: User authentication
- **RegisterPage**: Multi-step registration (3 roles)
- **FarmerDashboard**: Farmer operations (listings, offers, earnings)
- **BuyerDashboard**: Buyer operations (searches, purchases)
- **TransporterDashboard**: Transporter operations (vehicles, trips)
- **CommoditySearchPage**: Browse and filter commodities
- **VehicleSearchPage**: Find transportation options

### Context & Services
- **AuthContext**: Global authentication state
- **apiService**: Centralized API calls
- **socketService**: Real-time notifications

## Features

### Authentication
- Role-based registration (farmer, buyer, transporter)
- Persistent login with JWT tokens
- Auto logout on token expiration

### Farmer Features
- Dashboard with earnings overview
- List commodities with pricing
- Receive and manage offers
- Request vehicles for transport
- Track transactions and earnings

### Buyer Features
- Search commodities with filters
- Send offers to farmers
- Track purchases
- Generate digital invoices
- Manage payments

### Transporter Features
- Register vehicles
- Manage fleet
- Accept transport requests
- Track earnings

### Real-time
- Socket.io integration for live updates
- Notifications for offers, allocations, etc.
- Live chat potential

## Styling

- Tailwind CSS for utility styling
- CSS modules for component-specific styles
- Responsive design (mobile, tablet, desktop)
- Green theme matching agricultural identity

## Form Handling

- React Hook Form for efficient form management
- Built-in validation
- Multi-step registration forms
- Error handling and display

## API Integration

Centralized API service with:
- Axios instance with default headers
- Auto token injection from localStorage
- Error handling with redirects on 401
- Organized endpoints by feature

## Build & Deploy

### Build Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
- Connect GitHub repo
- Set build command: `npm run build`
- Set publish directory: `build`

## Environment Variables

- `REACT_APP_API_URL`: Backend API base URL
- `REACT_APP_SOCKET_URL`: WebSocket server URL

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Code splitting with React Router
- Lazy loading of components
- Optimized images
- Minified CSS/JS in production

---

**AgriEasy Frontend** - Modern React web application for agricultural commerce
