const Review = require('../models/Review.js');
const ReviewService = require('../service/ReviewService.js');

class ReviewController {
    //rota: post /avaliacoes
    async create (req, res) {
        const avaliadorId = req.usuarioId
        const { avaliado_id, nota, comentario } = req.body;

        if (!avaliado_id || !nota) {
            return res.status(400).json({ error: 'avaliado_id e nota são obrigatórios.' });
        }

        if (String(avaliadorId) === String(avaliado_id)) {
            return res.status(400).json({ error: 'Você não pode avaliar a si mesmo.' });
        }

        try{
            const novaReview = new Review({
                avaliador_id: avaliadorId,
                avaliado_id,
                nota,
                comentario
            })
            await novaReview.save();

            res.status(201).json({ message: 'Avaliação registrada com sucesso.', review: novaReview });
        }catch (error){
            console.error('Erro ao salvar avaliação:', error);

            if(error.message.includes('UNIQUE constraint failed')){
                return res.status(400).json({ error: 'Você já avaliou este usuário.' });
            }

            if (error.message.includes('CHECK constraint failed')) {
                return res.status(400).json({ error: 'A nota deve ser entre 1 e 5.' });
            }

            res.status(500).json({ error: 'Erro ao registrar avaliação.' });
        }
    }

    // Rota: GET /avaliacoes/recebidas/:usuarioId
    async listByUser (req, res) {
        const { usuarioId } = req.params;
        
        try {
            const relatorio = await ReviewService.obterRelatorioUsuario(usuarioId);
            res.status(200).json(relatorio);
        }catch(error){
            console.error('Erro ao obter avaliações:', error);
            res.status(500).json({ error: 'Erro ao obter avaliações.' });
        }
    }
}


module.exports = new ReviewController();