const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const partes = authHeader.split(' ');
    if (partes.length !== 2) {
        return res.status(401).json({ error: 'Erro no formato do token' });
    }
    const [esquema, token] = partes;
    if (!/^Bearer$/i.test(esquema)) {
        return res.status(401).json({ error: 'Token malformado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        req.usuarioPerfil = decoded.perfil; 
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}