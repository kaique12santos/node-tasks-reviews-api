const express = require('express');
const reviewController = require('../controllers/ReviewController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', (req,res) => reviewController.create(req,res));
router.get('/recebidas/:usuarioId', (req,res) => reviewController.listByUser(req,res));

module.exports = router;