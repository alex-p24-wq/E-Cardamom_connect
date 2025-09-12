import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from "./routes/auth.js";
import farmerRoutes from "./routes/farmer.js";
import customerRoutes from "./routes/customer.js";
import agriCareRoutes from "./routes/agricare.js";
import hubManagerRoutes from "./routes/hubmanager.js";
import adminRoutes from "./routes/admin.js";

app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/agricare", agriCareRoutes);
app.use("/api/hubmanager", hubManagerRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Start server with automatic port fallback if port is busy
    const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

    const startListening = (port, attempt = 0) => {
      const server = app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempt < 5) {
          const nextPort = port + 1;
          console.warn(`⚠️ Port ${port} in use. Trying ${nextPort}...`);
          startListening(nextPort, attempt + 1);
        } else {
          console.error('❌ Failed to start server:', err);
          process.exit(1);
        }
      });
    };

    startListening(DEFAULT_PORT);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
