// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Transaction = require('./models/Transaction');

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123';

// Middleware
app.use(cors());
app.use(express.json());

// ======================
// Koneksi MongoDB
// ======================
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kartunland', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ======================
// Routes
// ======================

// Cek server
app.get('/', (req, res) => {
  res.json({ message: 'KartunLand backend OK' });
});

// Simpan transaksi baru
app.post('/api/transactions', async (req, res) => {
  try {
    const {
      txHash,
      videoId,
      videoTitle,
      buyer,
      priceEth,
      timestamp,
      status,
      networkName,
      chainId
    } = req.body;

    if (!txHash || !videoId || !videoTitle || !buyer || !priceEth) {
      return res.status(400).json({ message: 'Data transaksi tidak lengkap' });
    }

    const tx = await Transaction.create({
      txHash,
      videoId,
      videoTitle,
      buyer,
      priceEth,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      status: status || 'success',
      // ⬇️ PENTING: simpan info jaringan
      networkName: networkName || 'Unknown',
      chainId: chainId || null
    });

    res.status(201).json(tx);
  } catch (err) {
    console.error('Error membuat transaksi:', err);
    res.status(500).json({ message: 'Gagal menyimpan transaksi' });
  }
});

// Ambil daftar transaksi (admin only)
app.get('/api/transactions', async (req, res) => {
  try {
    const token = req.header('x-admin-token');
    if (!token || token !== ADMIN_TOKEN) {
      return res.status(401).send('Unauthorized');
    }

    const limit = parseInt(req.query.limit || '100', 10);

    const transactions = await Transaction.find({})
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json(transactions);
  } catch (err) {
    console.error('Error mengambil transaksi:', err);
    res.status(500).json({ message: 'Gagal mengambil transaksi' });
  }
});

// ======================
// Start server
// ======================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
