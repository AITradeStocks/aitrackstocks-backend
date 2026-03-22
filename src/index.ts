import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// API Keys (hardcoded for now)
const POLYGON_API_KEY = 'pk_p3f3a9f3a9f3a9f3a9f3a9f3a9f3a9f3';
const FINNHUB_API_KEY = 'c3a9f3a9f3a9f3a9f3a9f3a9f3a9f3a9';
const OPENAI_API_KEY = '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';
const QUIVER_API_KEY = 'fa814a0aa9c69e0f0b56b83f096d68b90d87e344';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  res.json({ token: 'demo-token', user: { id: '1', email, name } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  res.json({ token: 'demo-token', user: { id: '1', email, name: 'User' } });
});
