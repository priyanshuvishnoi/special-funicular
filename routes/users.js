const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra')
const User = require('../models/user');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { phone } = req.body;
    const dir = path.join('./uploads', `${phone}`);
    fs.exists(dir, exist => {
      if (!exist) return fs.mkdir(dir, error => cb(error, dir));
      fsExtra.emptyDirSync(dir)
      return cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now() + file.originalname}`.replace(' ', ''));
  },
});

const upload = multer({ storage });

router.get('/getDetails', async (req, res) => {
  try {
    const usersDetails = await User.find({});
    res.json({ usersDetails });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.post('/saveDetails', upload.single('resume'), async (req, res, next) => {
  const { name, phone, email } = req.body;
  try {
    const doc = await User.find({ email });
    if (doc.length < 1) {
      const newUser = User({
        _id: mongoose.Types.ObjectId(),
        name,
        email,
        phone,
        resume: req.file.path,
      });
      newUser.save();
      res.json({ status: 'OK' });
    } else {
      await User.replaceOne(
        { _id: doc._id },
        User({
          _id: mongoose.Types.ObjectId(),
          name,
          email,
          phone,
          resume: req.file.path,
        })
      );
      res.json({ status: 'OK' });
    }
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

module.exports = router;
