const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txHash: { type: String, required: true },
  videoId: { type: Number, required: true },
  videoTitle: { type: String, required: true },
  buyer: { type: String, required: true },
  priceEth: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'success' },

  // ⬇️ field tambahan untuk deteksi jaringan
  networkName: { type: String, default: 'Unknown' }, // contoh: "Ganache" / "Sepolia"
  chainId: { type: String, default: null }           // contoh: "0x539" / "0xaa36a7"
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
