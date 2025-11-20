const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  slug:    { type: String, required: true, unique: true }, // "home" | "about" | "services"
  blocks:  [{ sub: String, body: String }],               // flexible sections
  meta:    { description: String, keywords: String }
}, { timestamps: true });

module.exports = mongoose.model('Page', PageSchema);