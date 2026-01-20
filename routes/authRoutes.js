const express = require('express');
const authController = require('../controllers/AuthController.js');

const router = express.Router();

router.post('/registrar',(req, res) => authController.registrar(req,res));
router.post('/login',(req, res) => authController.login(req,res));



module.exports = router;