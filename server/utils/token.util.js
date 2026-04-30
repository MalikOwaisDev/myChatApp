const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

const generateJWT = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

const verifyJWT = (token) => jwt.verify(token, JWT_SECRET);

const generateRawResetToken = () => crypto.randomBytes(32).toString('hex');

module.exports = { generateJWT, verifyJWT, generateRawResetToken };
