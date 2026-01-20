const Task = require('../models/Task.js');

class TaskController {
    async create (req, res) {
        const usuario_id = req.usuarioId;
        const { titulo, descricao, status, prioridade } = req.body;
        
        if (!titulo || !descricao) {
            return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
        }

        try {
            const novaTarefa = new Task({ titulo, descricao, status, prioridade, usuario_id: usuario_id });
            await novaTarefa.save();
            res.status(201).json({ message: 'Tarefa criada com sucesso!', task: novaTarefa });
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            res.status(500).json({ error: 'Erro interno ao criar tarefa.' });
        }
    }

    async list (req, res) {
        const usuarioPerfil = req.usuarioPerfil;
        const usuarioId = req.usuarioId;

        try {
            let tarefas;
            if (usuarioPerfil === 'admin') {
                tarefas = await Task.findAll();
            } else {
                tarefas = await Task.findByUserId(usuarioId);
            }
            res.status(200).json({ tasks: tarefas });
        } catch (error) {
            console.error('Erro ao listar tarefas:', error);
            res.status(500).json({ error: 'Erro interno ao listar tarefas.' });
        }
    }
}

module.exports = new TaskController();