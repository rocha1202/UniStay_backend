const db = require('../config/db');

class Admin {

    //--Facilitadores--
    static async listarFacilitadores() {
        const [rows] = await db.execute(
            `SELECT id, nome, email, tipo, ativo FROM Users WHERE tipo = 'facilitador'`
        );
        return rows;
    }
    static async listarFacilitadoresPendentes() {
        const [rows] = await db.execute(
            `SELECT id, nome, email FROM Users WHERE tipo = 'facilitador' AND ativo = 0`
        );
        return rows;
    }
    //aprovar/despromover facilitador
    static async alterarStatusFacilitador(id) {
        const [result] = await db.execute(
            `UPDATE Users SET ativo = 1 - ativo WHERE id = ? AND tipo = 'facilitador'`,
            [id]
        );
        return result.affectedRows > 0;
    }


    //--Estudantes--
    static async listarEstudantes() {
        const [rows] = await db.execute(
            `SELECT id, nome, email, tipo, ativo FROM Users WHERE tipo = 'estudante'`
        );
        return rows;
    }
    //bloquear/desbloquear estudante
    static async alterarStatusEstudante(id) {
        const [result] = await db.execute(
            `UPDATE Users SET ativo = 1 - ativo WHERE id = ? AND tipo = 'estudante'`,
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


    //--Alojamentos--
  static async removerAlojamento(id) {
        const [result] = await db.execute(
            `DELETE FROM Accommodations WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }


    //--Eventos--
    static async removerEvento(id) {
        const [result] = await db.execute(
            `DELETE FROM Events WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Admin;
