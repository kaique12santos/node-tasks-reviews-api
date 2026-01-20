const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

class AuthController {
    // registrar novo usuário
    async registrar(req, res) {
        const { nome, email, senha ,perfil} = req.body;
        
        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Todos os são obrigatórios.' });
        }
    
        try {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email já está em uso.' });
            }

            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);
            const novoUsuario = new User({ nome, email, senha_hash: senhaHash, perfil: perfil });
            await novoUsuario.save();

            res.status(201).json({ message: 'Usuário registrado com sucesso!',
                user: {
                    id: novoUsuario.id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email,
                    perfil: novoUsuario.perfil
                }
            });
        } catch (error) {
            console.error('ERRO REAL no registrar:', error);
            if (error.message.includes('Perfil inválido')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro ao registrar usuário.' });
        
        }
    }
    // login de usuário
    async login(req, res) {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        try {
            const usuario = await User.findByEmail(email);
            if (!usuario) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const isMatch = await bcrypt.compare(senha, usuario.senha_hash);
            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }
            const token = jwt.sign(
                { id: usuario.id, perfil: usuario.perfil },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login realizado com sucesso!',
                token: token,
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    perfil: usuario.perfil
                }
            })
        } catch (error) {
            console.log('ERRO REAL no login:', error); 
            res.status(500).json({ error: 'Erro ao realizar login.' });
        }
    
    }
}

module.exports = new AuthController();