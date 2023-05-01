const { Router } = require('express');

const authController = require('./authControllers');

const router = Router();

router.get('/register', authController.get_register);
router.get('/login', authController.get_login);

router.post('/register',authController.post_register);
router.post('/login', authController.post_login);
router.post('/logout', authController.post_logout);
// router.get('/test', authController.get_test);
module.exports = router;