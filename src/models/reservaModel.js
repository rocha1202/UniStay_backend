const db = require('../config/db');

class Reservation {
  static async isAvailable(accommodation_id, data_inicio, data_fim) {
    const [rows] = await db.execute(
      `SELECT * FROM Reservations
       WHERE accommodation_id = ?
       AND estado = 'confirmada' OR estado = 'pendente'
       AND NOT (data_fim < ? OR data_inicio > ?)`,
      [accommodation_id, data_inicio, data_fim]
    );
    return rows.length === 0;
  }

  static async create({ user_id, accommodation_id, data_inicio, data_fim }) {
    const [result] = await db.execute(
      `INSERT INTO Reservations (user_id, accommodation_id, data_inicio, data_fim)
       VALUES (?, ?, ?, ?)`,
      [user_id, accommodation_id, data_inicio, data_fim]
    );
    return result.insertId;
  }

  static async findByUser (user_id) {
    const [rows] = await db.execute(
      `SELECT * FROM Reservations WHERE user_id = ?`,
      [user_id]
    );
    return rows;
  }

  static async findByFacilitador(facilitador_id) {
    const [rows] = await db.execute(
      `SELECT r.* FROM Reservations r
       JOIN Accommodations a ON r.accommodation_id = a.id
       WHERE a.user_id = ?`,
      [facilitador_id]
    );
    return rows;
  }

  static async updateEstado(id, facilitador_id, novoEstado) {
    const [result] = await db.execute(
      `UPDATE Reservations r
       JOIN Accommodations a ON r.accommodation_id = a.id
       SET r.estado = ?
       WHERE r.id = ? AND a.user_id = ?`,
      [novoEstado, id, facilitador_id]
    );
    return result.affectedRows > 0;
  }
//checkAccommodationExists
  static async checkAccommodationExists(accommodation_id) {
    const [rows] = await db.execute(
      'SELECT * FROM Accommodations WHERE id = ?',
      [accommodation_id]
    );
    return rows.length > 0;
  }
  static async findById(id) {
    const [[reserva]] = await db.execute(
      'SELECT estado, user_id, accommodation_id FROM Reservations WHERE id = ?',
      [id]
    );
    return reserva;
  }
  //procura através do accommodation_id na tabela Reservations o user_id da tabela Accommodations
  static async findUserByAccommodationId(accommodation_id) {
    const [[user]] = await db.execute(
      `SELECT a.user_id FROM Reservations r
       JOIN Accommodations a ON r.accommodation_id = a.id
       WHERE r.accommodation_id = ?`,
      [accommodation_id]
    );
    return user ? user.user_id : null;
  }
}
module.exports = Reservation;
