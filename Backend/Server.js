// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import mongoose from "mongoose";

// import authRoutes from "./routes/auth.js";

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// // app.use("/api/auth", authRoutes);
// app.use("/api/auth", (req, res, next) => {
//   console.log("➡️ Hit /api/auth route:", req.method, req.url);
//   next();
// }, authRoutes);


// app.get("/", (req, res) => {
//   res.send("🚀 Server is running!");
// });
// app.post("/testsignup", (req, res) => {
//   res.json({ message: "Direct test route works ✅" });
// });


// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   ssl: true,
//   tlsAllowInvalidCertificates: true, // ⚠️ only use this for local dev on Windows
//   serverSelectionTimeoutMS: 10000
// })
// .then(() => console.log("✅ MongoDB Atlas connected"))
// .catch(err => console.error("❌ MongoDB error:", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));








// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import mongoose from "mongoose";
// import authRoutes from "./routes/auth.js";
// import petitionRoutes from "./routes/petitions.js";

// dotenv.config();

// const app = express();

// // Enhanced CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000",
//   credentials: true
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Request logging middleware
// app.use((req, res, next) => {
//   console.log(`➡️ ${req.method} ${req.url}`);
//   if (req.method === 'POST' || req.method === 'PUT') {
//     console.log('📦 Request body:', req.body);
//   }
//   next();
// });

// // Mount routes
// app.use("/api/auth", authRoutes);
// app.use("/api/petitions", petitionRoutes);

// // Health check with better response
// app.get("/", (req, res) => {
//   res.json({ 
//     message: "🚀 Server is running!",
//     timestamp: new Date().toISOString(),
//     version: "1.0.0",
//     endpoints: {
//       auth: "/api/auth",
//       petitions: "/api/petitions"
//     }
//   });
// });

// // Test route for POST requests
// app.post("/api/test-post", (req, res) => {
//   console.log("✅ Test POST received:", req.body);
//   res.json({ 
//     message: "POST request successful",
//     receivedData: req.body,
//     timestamp: new Date().toISOString()
//   });
// });

// // Test route for petitions
// app.get("/api/test-petitions", async (req, res) => {
//   try {
//     res.json({
//       message: "Petitions API is working",
//       endpoints: {
//         "GET /": "Get all petitions",
//         "GET /:id": "Get single petition",
//         "POST /": "Create petition (protected)",
//         "PUT /:id": "Update petition (protected)",
//         "DELETE /:id": "Delete petition (protected)",
//         "POST /:id/sign": "Sign petition (protected)",
//         "GET /user/my-petitions": "Get user's petitions (protected)",
//         "GET /user/signed-petitions": "Get signed petitions (protected)"
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('❌ Error:', err);
//   res.status(500).json({ 
//     error: 'Internal server error',
//     message: err.message,
//     timestamp: new Date().toISOString()
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ 
//     error: 'Route not found',
//     path: req.url,
//     method: req.method,
//     timestamp: new Date().toISOString()
//   });
// });

// // MongoDB Connection with better error handling
// mongoose.connect(process.env.MONGO_URI, {
//   ssl: true,
//   tlsAllowInvalidCertificates: true,
//   serverSelectionTimeoutMS: 10000,
//   socketTimeoutMS: 45000,
//   connectTimeoutMS: 10000,
//   retryWrites: true,
//   w: 'majority'
// })
// .then(() => console.log("✅ MongoDB Atlas connected successfully"))
// .catch(err => {
//   console.error("❌ MongoDB connection error:", err);
//   process.exit(1);
// });

// // MongoDB connection events
// mongoose.connection.on('connected', () => {
//   console.log('✅ Mongoose connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('❌ Mongoose connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('⚠️ Mongoose disconnected from MongoDB');
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   try {
//     await mongoose.connection.close();
//     console.log('✅ MongoDB connection closed through app termination');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error during shutdown:', err);
//     process.exit(1);
//   }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
//   console.log(`🗄️ MongoDB: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`);
// });




import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import petitionRoutes from "./routes/petitions.js";

dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📦 Request body:', req.body);
  }
  next();
});

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/petitions", petitionRoutes);

// Health check with DB status
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Server is running!",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get("/api/db-status", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMessages = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  res.json({
    status: statusMessages[dbStatus] || 'Unknown',
    readyState: dbStatus
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
});