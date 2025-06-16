const db = require('../config/db');

class Event {
    static async findByTitulo(titulo) {
        const query = 'SELECT * FROM events WHERE titulo = ?';
        const [rows] = await db.execute(query, [titulo]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create({ titulo, descricao, tipo, data, user_id }) {
        const query = 'INSERT INTO events (titulo, descricao, tipo, data, user_id) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [titulo, descricao, tipo, data, user_id]);
        return { id: result.insertId, titulo, descricao, tipo, data, user_id };
    }

    static async listAll(filtros) {
        let query = 'SELECT * FROM Events WHERE 1=1';
        const params = [];

        if (filtros.titulo) {
            query += ' AND titulo LIKE ?';
            params.push(`%${filtros.titulo}%`);
        }

        if (filtros.descricao) {
            query += ' AND descricao LIKE ?';
            params.push(`%${filtros.descricao}%`);
        }

        if (filtros.tipo) {
            query += ' AND tipo = ?';
            params.push(tipo);
        }

        if (filtros.data) {
            query += ' AND data = ?';
            params.push(filtros.data);
        }

        const [rows] = await db.execute(query, params);
        return rows;
    }
    static async isParticipating(user_id, event_id) {
        const query = 'SELECT * FROM EventParticipation WHERE user_id = ? AND event_id = ?';
        const [rows] = await db.execute(query, [user_id, event_id]);
        return rows.length > 0;
    }
    static async participate(user_id, event_id) {
        const [result] = await db.execute(
            'INSERT INTO EventParticipation (user_id, event_id) VALUES (?, ?)',
            [user_id, event_id]
        );
        return result.insertId;
    }
    static async myEvents(user_id) {
        const [rows] = await db.execute(
            `SELECT e.* FROM Events e
       JOIN EventParticipation ep ON e.id = ep.event_id
       WHERE ep.user_id = ?`,
            [user_id]
        );
        return rows;
    }
    static async delete(id) {
        const [result] = await db.execute('DELETE FROM Events WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findByIdF(id) {
        const [result] = await db.execute('select user_id from events where id =?', [id]);
        return result[0];
    }
    static async getInscritos(id) {
        const query = `
            SELECT u.id, u.nome, u.email
            FROM EventParticipation ep
            JOIN Users u ON ep.user_id = u.id
            WHERE ep.event_id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows;
    }
}


module.exports = Event;
