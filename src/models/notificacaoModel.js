const db = require('../config/db');

class Notification {
  static async create({ user_id, titulo, mensagem }) {
    try {
      const [result] = await db.execute(
        `INSERT INTO notifications (user_id, titulo, mensagem, data)
         VALUES (?, ?, ?, NOW())`, // Assuming 'data' is the correct column for the timestamp
        [user_id, titulo, mensagem]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return false;
    }
  }

  static async listByUser(user_id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY data DESC',
        [user_id]
      );
      //passa lidas a 1
      if (rows.length > 0) {
        await db.execute(
          'UPDATE notifications SET lida = 1 WHERE user_id = ?',
          [user_id]
        );
      }
      return rows;
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      return [];
    }
  }
}

module.exports = Notification;
