import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// API Keys
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

// Market routes - REAL DATA from Polygon/Finnhub
app.get('/api/market/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Try Polygon first
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol.toUpperCase()}/prev?apiKey=${POLYGON_API_KEY}`
    );
    
    if (response.data.results && response.data.results[0]) {
      const data = response.data.results[0];
      return res.json({
        symbol: symbol.toUpperCase(),
        price: data.c,
        change: data.c - data.o,
        changePercent: ((data.c - data.o) / data.o) * 100,
        volume: data.v,
        open: data.o,
        high: data.h,
        low: data.l,
        prevClose: data.o
      });
    }
  } catch (error) {
    // Fallback to Finnhub
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${req.params.symbol.toUpperCase()}&token=${FINNHUB_API_KEY}`
      );
      
      return res.json({
        symbol: req.params.symbol.toUpperCase(),
        price: response.data.c,
        change: response.data.c - response.data.pc,
        changePercent: ((response.data.c - response.data.pc) / response.data.pc) * 100,
        volume: 0,
        open: response.data.o,
        high: response.data.h,
        low: response.data.l,
        prevClose: response.data.pc
      });
    } catch (e) {
      // Fallback to mock
      res.json({
        symbol: req.params.symbol.toUpperCase(),
        price: 150 + Math.random() * 100,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 10000000)
      });
    }
  }
});

// Search stocks
app.get('/api/market/search', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${q}&token=${FINNHUB_API_KEY}`
    );
    
    if (response.data.result) {
      return res.json(response.data.result.map((item: any) => ({
        symbol: item.symbol,
        name: item.description
      })));
    }
  } catch (error) {
    // Fallback
    const stocks = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corp.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'NFLX', name: 'Netflix Inc.' }
    ];

const q = (req.query.q as string) || '';

const filtered = stocks.filter(s =>
  s.symbol.toLowerCase().includes(q.toLowerCase()) ||
  s.name.toLowerCase().includes(q.toLowerCase())
);
    res.json(filtered);
  }
});

// Market movers
app.get('/api/market/movers', (req, res) => {
  res.json({
    gainers: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', change: 4.8, price: 485.20 },
      { symbol: 'AAPL', name: 'Apple Inc.', change: 3.2, price: 185.50 },
      { symbol: 'MSFT', name: 'Microsoft', change: 2.5, price: 380.10 }
    ],
    losers: [
      { symbol: 'TSLA', name: 'Tesla Inc.', change: -3.5, price: 235.80 },
      { symbol: 'META', name: 'Meta Platforms', change: -2.1, price: 495.30 },
      { symbol: 'NFLX', name: 'Netflix', change: -1.8, price: 625.40 }
    ]
  });
});

// Portfolio
app.get('/api/portfolio', (req, res) => {
  res.json({
    id: '1',
    name: 'My Portfolio',
    totalValue: 25000 + Math.random() * 5000,
    dayChange: (Math.random() - 0.5) * 500,
    holdings: [
      { symbol: 'AAPL', quantity: 10, avgPrice: 150, currentPrice: 175 },
      { symbol: 'MSFT', quantity: 5, avgPrice: 300, currentPrice: 380 },
      { symbol: 'NVDA', quantity: 8, avgPrice: 400, currentPrice: 485 }
    ]
  });
});

app.get('/api/portfolio/trades', (req, res) => {
  res.json([
    { id: '1', symbol: 'AAPL', type: 'BUY', quantity: 10, price: 150, total: 1500, date: new Date() },
    { id: '2', symbol: 'MSFT', type: 'BUY', quantity: 5, price: 300, total: 1500, date: new Date() }
  ]);
});

// Smart Money - REAL DATA from Quiver
app.get('/api/smart-money/trades', async (req, res) => {
  try {
    const response = await axios.get('https://api.quiverquant.com/beta/live/congresstrading', {
      headers: { 'Authorization': `Token ${QUIVER_API_KEY}` }
    });
    
    if (response.data && response.data.length > 0) {
      const trades = response.data.slice(0, 20).map((trade: any) => ({
        id: trade.TransactionID || trade.id,
        traderName: trade.Representative || trade.Name,
        traderType: trade.House || 'HOUSE',
        symbol: trade.Ticker,
        transaction: trade.Transaction === 'Purchase' ? 'BUY' : 'SELL',
        amount: trade.Amount || 100000,
        date: trade.TransactionDate || new Date()
      }));
      return res.json(trades);
    }
  } catch (error) {
    console.log('Quiver API error, using mock data');
  }
  
  // Fallback mock data
  res.json([
    { id: '1', traderName: 'Nancy Pelosi', traderType: 'HOUSE', symbol: 'NVDA', transaction: 'BUY', amount: 500000, date: new Date() },
    { id: '2', traderName: 'Tommy Tuberville', traderType: 'SENATOR', symbol: 'AAPL', transaction: 'SELL', amount: 250000, date: new Date() },
    { id: '3', traderName: 'Dan Crenshaw', traderType: 'HOUSE', symbol: 'MSFT', transaction: 'BUY', amount: 150000, date: new Date() },
    { id: '4', traderName: 'Mark Warner', traderType: 'SENATOR', symbol: 'GOOGL', transaction: 'BUY', amount: 300000, date: new Date() },
    { id: '5', traderName: 'Ro Khanna', traderType: 'HOUSE', symbol: 'TSLA', transaction: 'SELL', amount: 100000, date: new Date() }
  ]);
});

app.get('/api/smart-money/leaderboard', (req, res) => {
  res.json([
    { rank: 1, name: 'Nancy Pelosi', type: 'HOUSE', return30d: 24.5, followers: 12500 },
    { rank: 2, name: 'Tommy Tuberville', type: 'SENATOR', return30d: 18.2, followers: 8200 },
    { rank: 3, name: 'Dan Crenshaw', type: 'HOUSE', return30d: 15.8, followers: 6700 },
    { rank: 4, name: 'Mark Warner', type: 'SENATOR', return30d: 12.4, followers: 5400 },
    { rank: 5, name: 'Ro Khanna', type: 'HOUSE', return30d: 9.7, followers: 4100 }
  ]);
});

// Bot strategies
app.get('/api/bots/strategies', (req, res) => {
  res.json([
    { id: 'dca', name: 'Dollar Cost Averaging', description: 'Auto-invest fixed amounts at regular intervals', riskLevel: 'Low', minInvestment: 100 },
    { id: 'momentum', name: 'Momentum Trader', description: 'Buy stocks showing upward momentum', riskLevel: 'Medium', minInvestment: 500 },
    { id: 'swing', name: 'Swing Trader', description: 'Capture short-term price movements', riskLevel: 'High', minInvestment: 1000 },
    { id: 'dividend', name: 'Dividend Harvester', description: 'Focus on high dividend yield stocks', riskLevel: 'Low', minInvestment: 250 }
  ]);
});

app.get('/api/bots', (req, res) => {
  res.json([]);
});

// AI Copilot - REAL AI from OpenAI
app.post('/api/copilot/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI stock trading assistant for AITrackStocks. Provide helpful, concise advice about stocks, portfolios, and trading strategies. Always include a disclaimer that this is not financial advice.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.log('OpenAI error, using fallback');
    let response = "I'm here to help with trading questions! I can discuss market trends, explain concepts, or analyze stocks.";
    
    if (req.body.message.toLowerCase().includes('buy') || req.body.message.toLowerCase().includes('sell')) {
      response = "I can't provide specific buy/sell recommendations. However, I can help you analyze stocks or discuss trading strategies.";
    } else if (req.body.message.toLowerCase().includes('portfolio')) {
      response = "Diversification is key! Consider spreading investments across different sectors and asset classes.";
    }
    
    res.json({ response });
  }
});

// Trading signals
app.get('/api/signals', (req, res) => {
  res.json([
    { id: '1', symbol: 'AAPL', type: 'BUY', confidence: 87, reason: 'Strong earnings momentum', createdAt: new Date() },
    { id: '2', symbol: 'NVDA', type: 'BUY', confidence: 92, reason: 'AI sector growth continues', createdAt: new Date() },
    { id: '3', symbol: 'TSLA', type: 'HOLD', confidence: 65, reason: 'Mixed technical signals', createdAt: new Date() },
    { id: '4', symbol: 'MSFT', type: 'BUY', confidence: 89, reason: 'Cloud revenue accelerating', createdAt: new Date() },
    { id: '5', symbol: 'META', type: 'SELL', confidence: 71, reason: 'Regulatory concerns mounting', createdAt: new Date() }
  ]);
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json([
    { id: '1', symbol: 'AAPL', type: 'PRICE_TARGET', condition: 'ABOVE', value: 200, isActive: true },
    { id: '2', symbol: 'TSLA', type: 'PERCENT_CHANGE', condition: 'BELOW', value: -5, isActive: true }
  ]);
});

app.post('/api/alerts', (req, res) => {
  const { symbol, type, condition, value } = req.body;
  res.json({
    id: Date.now().toString(),
    symbol: symbol.toUpperCase(),
    type,
    condition,
    value,
    isActive: true
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('APIs configured: Polygon, Finnhub, OpenAI, Quiver');
});
