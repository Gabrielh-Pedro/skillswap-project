const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  matchedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO'],
    default: 'PENDENTE',
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmedAt: {
    type: Date, // Nova data para armazenar quando o match foi confirmado
  }
});

const Swap = mongoose.model('Swap', swapSchema);

module.exports = Swap;
