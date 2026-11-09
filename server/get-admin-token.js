const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOne({ role: 'admin' });
  if (!user) {
    console.log('NO_ADMIN_FOUND');
    process.exit(1);
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  console.log('TOKEN=' + token);
  console.log('EMAIL=' + user.email);
  process.exit(0);
}).catch(err => { console.log('ERROR=' + err.message); process.exit(1); });
