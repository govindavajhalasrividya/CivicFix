require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const runSeeders = require('./config/seeder');

// Route imports
const healthRoutes = require('./routes/health.routes');
const complaintRoutes = require('./routes/complaint.routes');
const workerRoutes = require('./routes/worker.routes');
const categoryRoutes = require('./routes/category.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB then seed defaults
connectDB().then(() => runSeeders());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/admin', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[Server] CivicFix API running on http://localhost:${PORT}`);
});

module.exports = app;
