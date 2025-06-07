
// Avaliações Model
const db = require('../config/db');

class Rating {
    // findByDataFim
    static async findByDataFim(id) {
        const [rows] = await db.execute('SELECT data_fim FROM reservations WHERE id = ?', [id]);
        const dataFim = new Date(rows[0].data_fim);
        const hoje = new Date();
        if (dataFim > hoje) {
            return true; // Retorna true se a data de hoje for posterior à data de fim
        }
        return false; // Retorna false se não encontrar a reserva
    }
    // findByIdUser  
    static async findById(id) {
        const [rows] = await db.execute('SELECT user_id FROM reservations WHERE id = ?', [id]);
        return rows[0]; // Retorna o primeiro objeto do array
    }

    // verifica se já existe uma avaliação para esta reserva
    static async findByIdAva(id) {
        const [rows] = await db.execute('SELECT * FROM Ratings WHERE id_reservations = ?', [id]);
        return rows[0] || null; // Retorna o primeiro objeto do array ou null se não encontrado
    }

    // findByIdAccommodation
    static async findByIdAccommodation(id) {
        const [rows] = await db.execute('SELECT accommodation_id FROM reservations WHERE id = ?', [id]);
        return rows[0] ? rows[0].accommodation_id : null; // Retorna apenas o accommodation_id ou null se não encontrado
    }

    // create
    static async create({ user_id, accommodation_id, pontuacao, comentario, id_reservations }) {
        const [result] = await db.execute(
            `INSERT INTO Ratings (user_id, accommodation_id, pontuacao, comentario, data_avaliacao, id_reservations)
             VALUES (?, ?, ?, ?, NOW(), ?)`,
            [user_id, accommodation_id, pontuacao, comentario, id_reservations]
        );
        return result.insertId;
    }

    static async findByAccommodation(accommodation_id) {
        const [rows] = await db.execute(
            `SELECT pontuacao, comentario, data_avaliacao
       FROM Ratings WHERE accommodation_id = ?`,
            [accommodation_id]
        );
        return rows;
    }
    static async getResumoByAccommodation(accommodation_id) {
        const [[resumo]] = await db.execute(
            `SELECT 
              COUNT(*) AS total_avaliacoes,
              ROUND(AVG(pontuacao), 1) AS media_pontuacao
           FROM Ratings
           WHERE accommodation_id = ?`,
            [accommodation_id]
        );
        return resumo;
    }
}

module.exports = Rating;
