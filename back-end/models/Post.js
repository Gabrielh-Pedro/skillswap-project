const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true, maxlength: 200 },
  imageUrl: { type: String },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Usuários que deram match
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
