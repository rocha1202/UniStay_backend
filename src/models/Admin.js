const db = require('../config/db');

class Admin {
  static async getFacilitadoresPendentes() {
    const [rows] = await db.execute(
      `SELECT id, nome, email FROM Users WHERE tipo = 'facilitador' AND aprovado = 0`
    );
    return rows;
  }

  static async aprovarFacilitador(id) {
    const [result] = await db.execute(
      `UPDATE Users SET aprovado = 1 WHERE id = ? AND tipo = 'facilitador'`,
      [id]
    );
    return result.affectedRows > 0;
  }
  static async despromoverFacilitador(id) {
    const [result] = await db.execute(
      `UPDATE Users SET aprovado = 0 WHERE id = ? AND tipo = 'facilitador'`,
      [id]
    );
    return result.affectedRows > 0;
  }
  
  static async removerAlojamento(id) {
    const [result] = await db.execute(
      `DELETE FROM Accommodations WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  static async removerEvento(id) {
    const [result] = await db.execute(
      `DELETE FROM Events WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
  static async bloquearUtilizador(id) {
    const [result] = await db.execute(
      `UPDATE Users SET ativo = 0 WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
  
  static async desbloquearUtilizador(id) {
    const [result] = await db.execute(
      `UPDATE Users SET ativo = 1 WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
  
  static async removerUtilizador(id) {
    const [result] = await db.execute(
      `DELETE FROM Users WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
  
}

module.exports = Admin;
