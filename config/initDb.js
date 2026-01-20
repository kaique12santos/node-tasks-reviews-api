const connectDb = require('./db.js');

async function initDb() {
    let db;
    try {
        db = await connectDb();
        // PROJETO 1 GESTÃO DE TAREFAS
        // tabela de Usuários
        await db.exec(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha_hash TEXT NOT NULL,
                perfil TEXT DEFAULT 'user' CHECK(perfil IN ('user', 'admin')), -- Trava de segurança
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabela "usuarios" verificada/criada.');

        // tabela de Tarefas
        await db.exec(`
            CREATE TABLE IF NOT EXISTS tarefas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                descricao TEXT,
                status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'em_andamento', 'concluida')), -- Trava de status
                prioridade TEXT DEFAULT 'media' CHECK(prioridade IN ('baixa', 'media', 'alta')), -- Trava de prioridade
                usuario_id INTEGER NOT NULL,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela "tarefas" verificada/criada.');
        
        // --- PROJETO 2: Tabela de Avaliações ---
        // tabela de Avaliações
        await db.exec(`
            CREATE TABLE IF NOT EXISTS avaliacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                avaliador_id INTEGER NOT NULL,
                avaliado_id INTEGER NOT NULL,
                nota INTEGER NOT NULL CHECK(nota >=1 AND nota <= 5),
                comentario TEXT,
                data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (avaliador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (avaliado_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                UNIQUE(avaliador_id, avaliado_id)
            );
        `);
        console.log('Tabela "avaliacoes" verificada/criada.');

    } catch (error) {
        console.error('Erro ao criar tabelas:', error);
    } finally {
        if (db) {
            await db.close();
        }
    }
}

initDb();