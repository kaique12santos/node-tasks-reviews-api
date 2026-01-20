const connection = require('../config/db.js');

class Review {
    constructor(data) {
        this.id = data.id;
        this.avaliador_id = data.avaliador_id
        this.avaliado_id = data.avaliado_id;
        this.nota = data.nota;
        this.comentario = data.comentario;
        this.data_avaliacao = data.data_avaliacao;
    }

    async save() {
        const db = await connection();
        try {
            const result = await db.run(
                'INSERT INTO avaliacoes (avaliador_id, avaliado_id, nota, comentario) VALUES (?, ?, ?, ?)',
                [this.avaliador_id, this.avaliado_id, this.nota, this.comentario]
            );
            this.id = result.lastID;
            return this;
        } finally {
            await db.close();
        }
    }

    static async findByAvaliadoId(avaliadoId) {
        const db = await connection();
        try {
            const rows = await db.all(
                'SELECT * FROM avaliacoes WHERE avaliado_id = ?',
                [avaliadoId]
            );
            return rows.map(row => new Review(row));
        } finally {
            await db.close();
        }
    }
}

module.exports = Review;