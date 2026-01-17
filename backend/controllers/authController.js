/**
 * ============================================
 * AUTH CONTROLLER
 * ============================================
 * Handles user authentication
 * Registration, login, logout for all roles
 */

const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Transporter = require('../models/Transporter');
const { generateAuthResponse } = require('../utils/tokenUtils');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * FARMER REGISTRATION
 * Registers a new farmer with farm details
 */
const registerFarmer = async (req, res) => {
  try {
    const { 
      firstName, lastName, email, phone, password,
      address, city, state, pincode,
      farmName, landArea, farmingType, location
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'Email already registered', 'EMAIL_EXISTS');
    }

    // Create new farmer
    const farmer = new Farmer({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'farmer',
      address,
      city,
      state,
      pincode,
      location: {
        type: 'Point',
        coordinates: location?.coordinates || [0, 0]
      },
      farmName,
      landArea,
      farmingType
    });

    // Save farmer
    await farmer.save();

    // Generate auth response
    const authResponse = generateAuthResponse(farmer);

    sendSuccess(res, 201, 'Farmer registered successfully', authResponse);
  } catch (error) {
    console.error('Farmer Registration Error:', error);
    sendError(res, 500, error.message, 'REGISTRATION_ERROR');
  }
};

/**
 * BUYER REGISTRATION
 * Registers a new buyer with shop details
 */
const registerBuyer = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, password,
      address, city, state, pincode,
      shopName, businessType, gstin, paymentMethods, commoditiesBuy, location
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'Email already registered', 'EMAIL_EXISTS');
    }

    // Check if GSTIN is unique
    const existingGSTIN = await Buyer.findOne({ gstin });
    if (existingGSTIN) {
      return sendError(res, 409, 'GSTIN already registered', 'GSTIN_EXISTS');
    }

    // Create new buyer
    const buyer = new Buyer({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'buyer',
      address,
      city,
      state,
      pincode,
      location: {
        type: 'Point',
        coordinates: location?.coordinates || [0, 0]
      },
      shopName,
      businessType,
      gstin,
      paymentMethods,
      commoditiesBuy
    });

    // Save buyer
    await buyer.save();

    // Generate auth response
    const authResponse = generateAuthResponse(buyer);

    sendSuccess(res, 201, 'Buyer registered successfully', authResponse);
  } catch (error) {
    console.error('Buyer Registration Error:', error);
    sendError(res, 500, error.message, 'REGISTRATION_ERROR');
  }
};

/**
 * TRANSPORTER REGISTRATION
 * Registers a new transporter/vehicle owner
 */
const registerTransporter = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, password,
      address, city, state, pincode,
      transporterType, companyName, licenseNumber, operatingRegions, location
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'Email already registered', 'EMAIL_EXISTS');
    }

    // Check if license number is unique (if provided)
    if (licenseNumber) {
      const existingLicense = await Transporter.findOne({ licenseNumber });
      if (existingLicense) {
        return sendError(res, 409, 'License number already registered', 'LICENSE_EXISTS');
      }
    }

    // Create new transporter
    const transporter = new Transporter({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'transporter',
      address,
      city,
      state,
      pincode,
      location: {
        type: 'Point',
        coordinates: location?.coordinates || [0, 0]
      },
      transporterType,
      companyName,
      licenseNumber,
      operatingRegions
    });

    // Save transporter
    await transporter.save();

    // Generate auth response
    const authResponse = generateAuthResponse(transporter);

    sendSuccess(res, 201, 'Transporter registered successfully', authResponse);
  } catch (error) {
    console.error('Transporter Registration Error:', error);
    sendError(res, 500, error.message, 'REGISTRATION_ERROR');
  }
};

/**
 * LOGIN
 * Authenticates user and returns JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return sendError(res, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Generate auth response
    const authResponse = generateAuthResponse(user);

    sendSuccess(res, 200, 'Login successful', authResponse);
  } catch (error) {
    console.error('Login Error:', error);
    sendError(res, 500, error.message, 'LOGIN_ERROR');
  }
};

/**
 * GET CURRENT USER
 * Returns authenticated user's profile
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password');

    if (!user) {
      return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
    }

    sendSuccess(res, 200, 'User profile retrieved', { user });
  } catch (error) {
    console.error('Get Current User Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

module.exports = {
  registerFarmer,
  registerBuyer,
  registerTransporter,
  login,
  getCurrentUser
};
