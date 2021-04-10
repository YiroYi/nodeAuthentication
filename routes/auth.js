const express = require('express');

const { check, body } = require('express-validator/check')

const authController = require('../controllers/auth');

const router = express.Router();

const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid mail.')
      .custom((value, {req}) => {
        // if(value === 'test1@test.com') {
        //   throw new Error('This email address is forbidden')
        // }
        // return true;
        return User.findOne({email: value})
          .then(userDoc => {
            if(userDoc) {
              return Promise.reject('E-mail has already used');
            }
        })
      }),
    body('password', 'Please add 5 length password')
      .isLength({min: 5})
      .isAlphanumeric(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if(value !== req.body.password) {
          throw new Error('Password has to match');
        }
        return true;
      })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
