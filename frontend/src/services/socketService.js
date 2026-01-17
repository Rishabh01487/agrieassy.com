/**
 * ============================================
 * SOCKET SERVICE
 * ============================================
 * Real-time communication using Socket.io
 * Notifications, live updates
 */

import io from 'socket.io-client';
import { SOCKET_URL, SOCKET_EVENTS } from '../config';

let socket = null;
let listeners = {};

/**
 * Initialize Socket Connection
 */
export const initializeSocket = (user) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: localStorage.getItem('token')
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  // Join user's room
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    socket.emit('joinRoom', {
      userId: user._id,
      role: user.role
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

/**
 * Listen to socket events
 */
export const onSocketEvent = (event, callback) => {
  if (!socket) return;

  if (!listeners[event]) {
    listeners[event] = [];
  }

  socket.on(event, callback);
  listeners[event].push(callback);
};

/**
 * Emit socket event
 */
export const emitSocketEvent = (event, data) => {
  if (!socket) return;
  socket.emit(event, data);
};

/**
 * Remove socket listener
 */
export const offSocketEvent = (event, callback) => {
  if (!socket) return;
  socket.off(event, callback);
};

/**
 * Get socket instance
 */
export const getSocket = () => socket;

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    listeners = {};
  }
};
