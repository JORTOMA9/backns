const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // باش نقراو المتغيرات من ملف .env

// كنجيبو الروابط لي صاوبنا
const authRoutes = require('./routes/authRoutes');

// كنبداو التطبيق ديال Express
const app = express();

// Middlewares
app.use(cors()); // باش الفرونتاند يقدر يصيفط ريكويست للباكاند بلا مشاكل
app.use(express.json()); // باش السيرڤر يفهم البيانات لي كتجي بصيغة JSON من req.body

// الروابط (Routes)
// أي ريكويست كيبدا بـ /api/auth غيمشي لـ authRoutes
app.use('/api/auth', authRoutes);

// الاتصال بقاعدة البيانات (MongoDB)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connecté b Najah!');
  })
  .catch((error) => {
    console.error('❌ Mochkil f l connection m3a MongoDB:', error.message);
  });

// تشغيل السيرڤر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server khdam mzyan 3la l port ${PORT}`);
});