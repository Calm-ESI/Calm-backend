const router = require('express').Router();

const userControllers = require('./userControllers');
const codeRoutes = require('./code/codeRoutes');
const requireAuth = require('../auth/authMiddleware');


// router.use(requireAuth);

//user management
router.get('/:userId', userControllers.get_user); //get the personal user page
router.put('/:userId/edit', userControllers.update_user); //edit user information
router.delete('/:userId/delete', userControllers.delete_user); //delete the user

router.use('/:userId/code', codeRoutes);

module.exports = router;