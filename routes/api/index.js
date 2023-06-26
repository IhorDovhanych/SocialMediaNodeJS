const router = require('express').Router();
const userRoutes = require('./userRoutes');
const publicationRoutes = require('./publicationRoutes');

router.use('/users', userRoutes);
router.use('/publications', publicationRoutes);

module.exports = router;
