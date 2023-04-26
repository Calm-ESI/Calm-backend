const router = require('express').Router();

const addressingModeRoutes = require('./addressing_modes/addressingModeRoutes');
const componentRoutes = require('./components/componentRoutes');

router.use('/addressing-modes', addressingModeRoutes);
router.use('/components', componentRoutes);

module.exports = router;