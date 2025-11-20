const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  type:  { type:String, enum:['page','click'], required:true },
  label: { type:String }, // e.g. 'home' or projectId
  date:  { type:Date, default:Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);