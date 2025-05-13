const db = require('../config/db');

class Event {
  static async create({ titulo, descricao, tipo, data, user_id }) {
    const [result] = await db.execute(
      'INSERT INTO Events (titulo, descricao, tipo, data, user_id) VALUES (?, ?, ?, ?, ?)',
      [titulo, descricao, tipo, data, user_id]
    );
    return result.insertId;
  }

  static async listAll({ tipo, data }) {
    let query = 'SELECT * FROM Events WHERE 1=1';
    const params = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    if (data) {
      query += ' AND data = ?';
      params.push(data);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM Events WHERE id = ?', [id]);
    return result.affectedRows > 0;
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
}

module.exports = Event;
