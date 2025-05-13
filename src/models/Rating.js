const db = require('../config/db');

class Rating {
    static async create({ user_id, accommodation_id, pontuacao, comentario }) {
        const [result] = await db.execute(
            `INSERT INTO Ratings (user_id, accommodation_id, pontuacao, comentario)
       VALUES (?, ?, ?, ?)`,
            [user_id, accommodation_id, pontuacao, comentario]
        );
        return result.insertId;
    }

    static async alreadyReserved(user_id, accommodation_id) {
        const [rows] = await db.execute(
            `SELECT * FROM Reservations
       WHERE user_id = ? AND accommodation_id = ?
       AND estado = 'confirmada' AND data_fim < CURDATE()`,
            [user_id, accommodation_id]
        );
        return rows.length > 0;
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
