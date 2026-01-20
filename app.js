const express = require('express');
const authRoutes = require('./routes/authRoutes.js');  
const taskRoutes = require('./routes/taskRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');


const app = express();

app.use(express.json());
app.use('/auth', authRoutes);  // Usa as rotas de autenticação
app.use('/tarefas', taskRoutes); // Usa as rotas de tarefas
app.use('/avaliacoes', reviewRoutes); // Usa as rotas de avaliações

app.get('/', (req, res) => {
    res.status(200).send('API de Gestão de Tarefas rodando');
})

module.exports = app;