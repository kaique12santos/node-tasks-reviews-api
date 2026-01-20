const connectionDb = require('../config/db.js');

class User {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.email = data.email;
        this.senha_hash = data.senha_hash;
        this.perfil = data.perfil || 'user';
    }

    async save(){

        const perfisPermitidos = ['user', 'admin'];
        if (this.perfil && !perfisPermitidos.includes(this.perfil)) {
            throw new Error('Perfil inválido. Deve ser "user" ou "admin".');            
        }

        const db = await connectionDb();
        try{
            const result = await db.run(
                'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)',
                [this.nome, this.email, this.senha_hash, this.perfil]
            );
            this.id = result.lastID;
            return this;
        } finally{
            await db.close();
        }
    }

    static async findByEmail(email){
        const db = await connectionDb();
        try{
            const data = await db.get(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );
            if(!data) return null;

            return new User(data);
        } finally{
            await db.close();
        }
    }
}

module.exports = User;

