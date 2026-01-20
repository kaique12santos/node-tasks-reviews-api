const express = require('express');
const taskController = require('../controllers/TaskController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, (req, res) => taskController.create(req, res));
router.get('/', authMiddleware, (req, res) => taskController.list(req, res));

module.exports = router;