const connection = require('../config/db.js'); 

class Task {
    constructor(data) {
        this.id = data.id;
        this.titulo = data.titulo;
        this.descricao = data.descricao;
        this.status = data.status || 'pendente';
        this.prioridade = data.prioridade || 'media';
        this.usuario_id = data.usuario_id;
        this.data_criacao = data.data_criacao;
    }

    async save(){
        const db = await connection();
        try{
            const result = await db.run(
                `INSERT INTO tarefas (titulo, descricao, status, prioridade, usuario_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [this.titulo, this.descricao, this.status, this.prioridade, this.usuario_id]
            );
            this.id = result.lastID;
            return this;
        } finally {
            await db.close();
        }
    }

    static async findByUserId(usuario_id){
        const db = await connection();
        try{
            const rows = await db.all(
                `SELECT * FROM tarefas WHERE usuario_id = ?`,
                [usuario_id]
            );
            return rows.map(row => new Task(row));
        } finally {
            await db.close();
        }
    }

    static async findAll(){
        const db = await connection();
        try{
            const rows = await db.all(`SELECT * FROM tarefas`);
            return rows.map(row => new Task(row));
        } finally {
            await db.close();
        }
    }
}

module.exports = Task;