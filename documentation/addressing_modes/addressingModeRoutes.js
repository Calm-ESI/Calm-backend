const router = require('express').Router();

const addressingModeControllers = require('./addressingModeControllers');

router.get('/', addressingModeControllers.get_addressing_mode)
router.get('/all', addressingModeControllers.get_all_addressing_modes);
router.post('/add', addressingModeControllers.add_addressing_mode);
router.put('/edit', addressingModeControllers.edit_addressing_mode);
router.delete('/delete', addressingModeControllers.delete_addressing_mode);


module.exports = router;