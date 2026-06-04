const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

// رابط التسجيل (ماكيحتاجش token حيت يلاه غيتسجل)
router.post('/register', authController.register);

// روابط الخطوات (كندخلو authMiddleware باش ما يدوز ليهم غير لي مكونيكطي)
router.put('/step1', authMiddleware, authController.step1);
router.put('/step2', authMiddleware, authController.step2);
router.put('/step3', authMiddleware, authController.step3);

module.exports = router;