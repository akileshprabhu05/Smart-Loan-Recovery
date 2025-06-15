function generateStrategy(borrower) {
    const { risk, loanAmount, dueDate } = borrower;
    const today = new Date();
    const dueInDays = Math.ceil((new Date(dueDate) - today) / (1000 * 60 * 60 * 24));
    let recommendation = '';
    let confidence = '';
  
    if (risk === 'High' || loanAmount > 100000) {
      recommendation = 'Initiate legal notice and follow-up every 2 days';
      confidence = dueInDays < 15 ? 'High' : 'Medium';
    } else if (risk === 'Medium') {
      recommendation = 'Offer loan restructuring plan and send reminders';
      confidence = dueInDays < 30 ? 'Medium' : 'High';
    } else {
      recommendation = 'Send friendly reminder and thank-you mail';
      confidence = 'High';
    }
  
    return { recommendation, confidence };
  }
  
module.exports = generateStrategy;  