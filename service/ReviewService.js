const Review = require('../models/Review.js');

class ReviewService {
    calcularMedia (review){
        if (review.length === 0) return 0;
        
        const soma = review.reduce((total, review) => total + review.nota, 0);
        return (soma / review.length).toFixed(2);
    }

    async obterRelatorioUsuario(usuarioId){
        const reviews = await Review.findByAvaliadoId(usuarioId);
        const media = this.calcularMedia(reviews);

        return {
            total_avaliacoes: reviews.length,
            media_nota: media,
            lista_avaliacoes: reviews
        };
    }
}

module.exports = new ReviewService();