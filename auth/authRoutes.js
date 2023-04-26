const { Router } = require('express');

const authController = require('./authControllers');

const router = Router();

router.get('/signup', authController.get_signup);
router.get('/login', authController.get_login);

router.post('/signup',authController.post_signup);
router.post('/login', authController.post_login);
router.post('/logout', authController.post_logout);
module.exports = router;