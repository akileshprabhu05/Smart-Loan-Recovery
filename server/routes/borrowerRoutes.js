const express = require('express');
const router = express.Router();
const Borrower = require('../models/Borrower');
const generateStrategy = require('../utils/strategyGenerator');

router.post('/', async (req, res) => {
  const data = req.body;
  const strategy = generateStrategy(data);

  const newBorrower = new Borrower({
    ...data,
    strategy,
  });

  await newBorrower.save();
  res.status(201).json(newBorrower);
});


router.get('/dash', async (req, res) => {
  try {
    const borrowers = await Borrower.find();
    const total = borrowers.length;
    const highRisk = borrowers.filter(b => b.risk === 'High').length;
    const recovered = borrowers.filter(b => b.status === 'Paid').length;
    const recoveryRate = total === 0 ? 0 : Math.round((recovered / total) * 100);

    res.json({ total, highRisk, recoveryRate });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard fetch failed', error: err });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const borrowers = await Borrower.find();

    const riskLevels = ['High', 'Medium', 'Low'];
    const loanData = riskLevels.map(level => {
      const riskGroup = borrowers.filter(b => b.risk === level);
      const recovered = riskGroup.filter(b => b.status === 'Paid').length;
      const unrecovered = riskGroup.filter(b => b.status !== 'Paid').length;

      return {
        name: `${level} Risk`,
        recovered,
        unrecovered,
      };
    });

    const strategyData = [
      { name: 'Restructure Plan', value: 45 },
      { name: 'Follow-up Calls', value: 30 },
      { name: 'Legal Notice', value: 15 },
      { name: 'Thank You Mail', value: 10 },
    ];

    res.json({ loanData, strategyData });
  } catch (err) {
    console.error('Analytics fetch failed:', err);
    res.status(500).json({ message: 'Analytics data fetch failed', error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Borrower.findByIdAndDelete(req.params.id);
    res.json({ message: 'Borrower deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete borrower', error: err });
  }
});

router.get('/', async (req, res) => {
  const borrowers = await Borrower.find();
  res.json(borrowers);
});

router.get('/:id', async (req, res) => {
  const borrower = await Borrower.findById(req.params.id);
  res.json(borrower);
});

module.exports = router;
