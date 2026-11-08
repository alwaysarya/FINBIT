const Beneficiary = require('../models/Beneficiary');
const Account = require('../models/Account');

const addBeneficiary = async (req, res, next) => {
  try {
    const { name, accountNumber, nickname, bankName } = req.body;
    if (!name || !accountNumber) { res.status(400); throw new Error('Name and account number required'); }

    // Check karo account exist karta hai ya nahi
    const accountExists = await Account.findOne({ accountNumber });
    if (!accountExists) { res.status(404); throw new Error('Account number does not exist in FINBIT'); }

    // Check karo already save toh nahi hai
    const existing = await Beneficiary.findOne({ user: req.user._id, accountNumber });
    if (existing) { res.status(400); throw new Error('Beneficiary already added'); }

    const beneficiary = await Beneficiary.create({
      user: req.user._id, name, accountNumber, nickname, bankName
    });

    res.status(201).json({ message: 'Beneficiary added', beneficiary });
  } catch (error) { next(error); }
};

const getBeneficiaries = async (req, res, next) => {
  try {
    const list = await Beneficiary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) { next(error); }
};

const deleteBeneficiary = async (req, res, next) => {
  try {
    await Beneficiary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Beneficiary removed' });
  } catch (error) { next(error); }
};

module.exports = { addBeneficiary, getBeneficiaries, deleteBeneficiary };
