const Card = require('../models/Card');

// Random Card Number Generator
const generateCardDetails = () => {
  const cardNumber = `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
  const cvv = Math.floor(100 + Math.random() * 900).toString();
  const expiry = `${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/29`; // Sabka 2029 tak
  return { cardNumber, cvv, expiry };
};

// Card fetch karo ya naya banao
const getMyCard = async (req, res, next) => {
  try {
    let card = await Card.findOne({ user: req.user._id });
    
    if (!card) {
      // Agar card nahi hai toh naya banao
      const details = generateCardDetails();
      card = await Card.create({ user: req.user._id, ...details });
    }

    res.json(card);
  } catch (error) { next(error); }
};

// Card Freeze / Unfreeze karo
const toggleFreeze = async (req, res, next) => {
  try {
    const card = await Card.findOne({ user: req.user._id });
    if (!card) { res.status(404); throw new Error('Card not found'); }

    card.isFrozen = !card.isFrozen;
    await card.save();

    res.json({ message: card.isFrozen ? 'Card Frozen' : 'Card Unfrozen', isFrozen: card.isFrozen });
  } catch (error) { next(error); }
};

module.exports = { getMyCard, toggleFreeze };
