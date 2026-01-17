/**
 * ============================================
 * AGRIEASY - MAIN SERVER FILE
 * ============================================
 * This is the entry point for the AgriEasy backend
 * Initializes Express server, Socket.io, Database connections
 * and sets up all middleware and routes
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

/**
 * Connect to MongoDB
 * Establishes connection to MongoDB database using mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// ============================================
// IMPORT ROUTES
// ============================================

const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const transporterRoutes = require('./routes/transporterRoutes');
const commodityRoutes = require('./routes/commodityRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const billingRoutes = require('./routes/billingRoutes');
const searchRoutes = require('./routes/searchRoutes');

// ============================================
// SETUP ROUTES
// ============================================

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/transporter', transporterRoutes);
app.use('/api/commodity', commodityRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/search', searchRoutes);

// ============================================
// SOCKET.IO REAL-TIME COMMUNICATION
// ============================================

/**
 * Socket.IO Setup for Real-time Updates
 * Handles live notifications for farmers, buyers, and transporters
 */

io.on('connection', (socket) => {
  console.log(`✓ User connected: ${socket.id}`);

  // User joins their role-specific room
  socket.on('joinRoom', (data) => {
    const { userId, role } = data;
    socket.join(`${role}-${userId}`);
    socket.join(role);
    console.log(`✓ User ${userId} (${role}) joined their room`);
  });

  // Farmer broadcasts that they have a commodity for sale
  socket.on('farmerListCommodity', (data) => {
    io.to('buyer').emit('newCommodityAvailable', data);
  });

  // Buyer sends offer to farmer
  socket.on('sendOfferToFarmer', (data) => {
    io.to(`farmer-${data.farmerId}`).emit('offerReceived', data);
  });

  // Farmer accepts offer
  socket.on('acceptOffer', (data) => {
    io.to(`buyer-${data.buyerId}`).emit('offerAccepted', data);
  });

  // Farmer requests vehicle from transporter
  socket.on('requestVehicle', (data) => {
    io.to('transporter').emit('vehicleRequested', data);
  });

  // Transporter accepts vehicle request
  socket.on('acceptVehicleRequest', (data) => {
    io.to(`farmer-${data.farmerId}`).emit('vehicleAllocated', data);
  });

  // Billing notification
  socket.on('billingCreated', (data) => {
    io.to(`farmer-${data.farmerId}`).emit('billingNotification', data);
  });

  // Payment notification
  socket.on('paymentReceived', (data) => {
    io.to(`farmer-${data.farmerId}`).emit('paymentNotification', data);
  });

  socket.on('disconnect', () => {
    console.log(`✗ User disconnected: ${socket.id}`);
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

/**
 * Initialize the server
 * Connects to database and starts listening on specified port
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║     🌾 AGRIEASY SERVER STARTED 🌾          ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                           
║  Environment: ${process.env.NODE_ENV}
║  Socket.IO: Ready for real-time updates
║  Database: Connected
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, io };
