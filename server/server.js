// server/server.js - AgriSahayak Express Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Serve static frontend files
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback route for SPA
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  const distIndex = path.join(__dirname, '../client/dist', 'index.html');
  if (fs.existsSync(publicIndex)) {
    res.sendFile(publicIndex);
  } else if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.json({
      message: '🌾 AgriSahayak API Service is Running',
      docs: '/api/health',
      version: '2.0.0'
    });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌾 AgriSahayak Server running at http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
