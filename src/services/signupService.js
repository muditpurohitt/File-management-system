const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateJwt, SECRET } = require("../middleware/authMiddleware");


const signUp = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({ username, email, password: hashedPassword });
  
      const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
  
      res.json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = { signUp};