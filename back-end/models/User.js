const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  mainSkill: String,
  skills: [String],
  photo: { type: String },
  termsAccepted: { type: Boolean, default: false },
  whatsapp: { type: String },
  linkedin: { type: String },
  discord: { type: String },
  usernameUpdated: { type: Boolean, default: false },
  whatsappUpdated: { type: Boolean, default: false },
  linkedinUpdated: { type: Boolean, default: false },
  discordUpdated: { type: Boolean, default: false }
}, {
  validate: {
    validator: function() {
      return this.whatsapp || this.linkedin || this.discord;
    },
    message: 'Pelo menos um dos campos WhatsApp, LinkedIn ou Discord deve ser preenchido.'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
