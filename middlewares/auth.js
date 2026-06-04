const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // كنجبدو التوكن من الهيدر
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Makaynch token, access denied!' });

  try {
    // كنتأكدو واش التوكن صحيح
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secretkey');
    req.user = decoded; // كنزيدو الايدي ديال المستعمل فـ req
    next(); // كنخليوه يدوز للكونترولر
  } catch (error) {
    res.status(400).json({ message: 'Token machi s7i7' });
  }
};