const db = require('../config/db');

class Alojamentos {
  static async create(data) {
    const { titulo, descricao, zona, preco, camas, tipo_quarto, comodidades, user_id } = data;
    const [result] = await db.execute(
      'INSERT INTO accommodations (titulo, descricao, zona, preco, camas, tipo_quarto, comodidades, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [titulo, descricao, zona, preco, camas, tipo_quarto, comodidades, user_id]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM accommodations');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM accommodations WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id, user_id) {
    const [result] = await db.execute('DELETE FROM accommodations WHERE id = ? AND user_id = ?', [id, user_id]);
    return result.affectedRows > 0;
  }

  static async search(filtros) {
    let query = 'SELECT * FROM accommodations WHERE 1=1';
    const params = [];

    if (filtros.zona) {
      query += ' AND zona LIKE ?';
      params.push(`%${filtros.zona}%`);
    }

    if (filtros.preco_min) {
      query += ' AND preco >= ?';
      params.push(filtros.preco_min);
    }

    if (filtros.preco_max) {
      query += ' AND preco <= ?';
      params.push(filtros.preco_max);
    }

    if (filtros.camas) {
      query += ' AND camas >= ?';
      params.push(filtros.camas);
    }

    if (filtros.tipo_quarto) {
      query += ' AND tipo_quarto = ?';
      params.push(filtros.tipo_quarto);
    }

    if (filtros.disponivel_d1 && filtros.disponivel_d2) {
      query += `
    AND id NOT IN (
      SELECT accommodation_id FROM Reservations
      WHERE NOT (
        data_fim < ? OR data_inicio > ?
      )
      AND (estado = 'confirmada' OR estado = 'pendente')
    )
  `;
      params.push(filtros.disponivel_d1, filtros.disponivel_d2);
    }


    const [rows] = await db.execute(query, params);
    return rows;
  }
}

module.exports = Alojamentos;
