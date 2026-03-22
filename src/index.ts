import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Market routes
app.get('/api/market/quote/:symbol', (req, res) => {
  const { symbol } = req.params;
  res.json({
    symbol: symbol.toUpperCase(),
    price: 150 + Math.random() * 100,
    change: (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 5,
    volume: Math.floor(Math.random() * 10000000)
  });
});

app.get('/api/market/search', (req, res) => {
  const { q } = req.query;
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
  const filtered = stocks.filter(s => 
    s.symbol.toLowerCase().includes((q as string || '').toLowerCase()) ||
    s.name.toLowerCase().includes((q as string || '').toLowerCase())
  );
  res.json(filtered);
});

app.get('/api/market/movers', (req, res) => {
  res.json({
    gainers: [
      { symbol: 'AAPL', name: 'Apple Inc.', change: 5.2, price: 185.50 },
      { symbol: 'NVDA', name: 'NVIDIA Corp', change: 4.8, price: 485.20 },
      { symbol: 'MSFT', name: 'Microsoft', change: 3.5, price: 380.10 }
    ],
    losers: [
      { symbol: 'TSLA', name: 'Tesla Inc.', change: -4.2, price: 235.80 },
      { symbol: 'META', name: 'Meta Platforms', change: -3.1, price: 495.30 },
      { symbol: 'NFLX', name: 'Netflix', change: -2.8, price: 625.40 }
    ]
  });
});

// Portfolio routes
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

// Smart Money routes
app.get('/api/smart-money/trades', (req, res) => {
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

// Bot routes
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

// Copilot routes
app.post('/api/copilot/chat', (req, res) => {
  const { message } = req.body;
  let response = "I'm here to help with trading questions! I can discuss market trends, explain concepts, or analyze stocks.";
  
  if (message.toLowerCase().includes('buy') || message.toLowerCase().includes('sell')) {
    response = "I can't provide specific buy/sell recommendations. However, I can help you analyze stocks or discuss trading strategies.";
  } else if (message.toLowerCase().includes('portfolio')) {
    response = "Diversification is key! Consider spreading investments across different sectors and asset classes.";
  } else if (message.toLowerCase().includes('risk')) {
    response = "All investments carry risk. To manage risk: diversify, only invest what you can afford to lose, and use stop-loss orders.";
  }
  
  res.json({ response });
});

// Signals routes
app.get('/api/signals', (req, res) => {
  res.json([
    { id: '1', symbol: 'AAPL', type: 'BUY', confidence: 87, reason: 'Strong earnings momentum', createdAt: new Date() },
    { id: '2', symbol: 'NVDA', type: 'BUY', confidence: 92, reason: 'AI sector growth continues', createdAt: new Date() },
    { id: '3', symbol: 'TSLA', type: 'HOLD', confidence: 65, reason: 'Mixed technical signals', createdAt: new Date() },
    { id: '4', symbol: 'MSFT', type: 'BUY', confidence: 89, reason: 'Cloud revenue accelerating', createdAt: new Date() },
    { id: '5', symbol: 'META', type: 'SELL', confidence: 71, reason: 'Regulatory concerns mounting', createdAt: new Date() }
  ]);
});

// Alerts routes
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
});
