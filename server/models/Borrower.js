const mongoose = require('mongoose');

const BorrowerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  loanAmount: Number,
  dueDate: Date,
  risk: String,
  status: String,
  strategy: {
    recommendation: String,
    confidence: String,
  },
});

module.exports = mongoose.model('Borrower', BorrowerSchema);
