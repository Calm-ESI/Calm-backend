const router = require('express').Router();

const compnentControllers = require('./componentControllers');

router.get('/', compnentControllers.get_component)
router.get('/all', compnentControllers.get_all_components);
router.post('/add', compnentControllers.add_component);
router.put('/edit', compnentControllers.edit_component);
router.delete('/delete', compnentControllers.delete_component);


module.exports = router;