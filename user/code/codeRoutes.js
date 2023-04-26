const router = require('express').Router({ mergeParams: true });

const codeControllers = require('./codeControllers');

router.get('/get', codeControllers.get_code)
router.get('/all', codeControllers.get_all_codes);
router.post('/add', codeControllers.add_code);
router.put('/edit', codeControllers.edit_code);
router.delete('/delete', codeControllers.delete_code);

module.exports = router;