const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Monk DB instance
const auth = require('../middleware/authMiddleware'); // Authorization middleware
const monk = require('monk');

// POST /records - Save invoice
router.post('/records', auth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'User not authorized or inactive.' });
    }

    // Get the invoices collection
    const invoices = db.get('invoices');

    // Check if invoices collection exists
    if (!invoices) {
      return res.status(500).json({ error: 'Invoices collection not found' });
    }

    // Invoice data to be inserted
    const invoiceData = {
      ...req.body,
      userId: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const inserted = await invoices.insert(invoiceData); // Insert the data into 'invoices' collection

    res.status(201).json({ message: 'Invoice saved successfully', invoice: inserted });
  } catch (error) {
    console.error('Failed to save invoice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/records', auth, async (req, res) => {
    try {
      const user = req.user;
  
      if (!user || user.status !== 'active') {
        return res.status(403).json({ error: 'User not authorized or inactive.' });
      }
  
      const invoices = db.get('invoices');
  
      const records = await invoices.find({ userId: monk.id(user._id) }); // ✅ monk.id
  
      res.status(200).json(records);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
