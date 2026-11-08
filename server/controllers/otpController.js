const OTP = require('../models/OTP');
const User = require('../models/User');

// OTP Generate aur Send (Console me dikhega)
const sendOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(404); throw new Error('User not found'); }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
    await OTP.create({ email, otp, purpose });

    console.log(`\n\n🔑 OTP for ${email} is: ${otp}\n\n`); // Terminal me dikhega

    res.json({ message: 'OTP sent to your email (Check terminal)' });
  } catch (error) { next(error); }
};

// OTP Verify karo (2FA login ya password reset)
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp });
    if (!record) { res.status(400); throw new Error('Invalid or Expired OTP'); }

    await OTP.deleteOne({ _id: record._id }); // Use hone ke baad delete
    res.json({ message: 'OTP verified', valid: true });
  } catch (error) { next(error); }
};

module.exports = { sendOTP, verifyOTP };
