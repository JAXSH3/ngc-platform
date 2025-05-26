const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config({ path: './src/config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Basic route
app.get('/', (req, res) => {
    res.send('NGC Backend API Running');
});

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const premiumRoutes = require('./src/routes/premiumRoutes');
const errorHandler = require('./src/middleware/errorMiddleware');

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/premium', premiumRoutes);

// Error Handler Middleware (should be last piece of middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});