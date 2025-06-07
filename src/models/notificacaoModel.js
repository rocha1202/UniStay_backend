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
}

module.exports = Notification;
