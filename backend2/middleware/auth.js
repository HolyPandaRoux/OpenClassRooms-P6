const express = require('express');
const dotenv = require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jsonwebtoken.verify(token, process.env.token);
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid User ID";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
};
