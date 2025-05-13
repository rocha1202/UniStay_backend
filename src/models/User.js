const db = require('../config/db');

class User {
  static async create({ nome, email, password, tipo }) {
    const [result] = await db.execute(
      'INSERT INTO Users (nome, email, password, tipo, ativo) VALUES (?, ?, ?, ?, ?)',
      [nome, email, password, tipo, tipo === 'facilitador' ? 0 : 1]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  }
}

module.exports = User;
