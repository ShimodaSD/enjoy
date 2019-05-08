"use strict";
const Sql = require("../infra/sql");
module.exports = class Usuario {
    static validar(u) {
        u.nomeUsuario = (u.nomeUsuario || "").trim().toUpperCase();
        if (u.nomeUsuario.length < 3 || u.nomeUsuario.length > 50)
            return "Nome inválido";
        u.emailUsuario = (u.emailUsuario || "").trim().toUpperCase();
        if (u.emailUsuario.length < 1 || u.emailUsuario.length > 100)
            return "Email inválido";
        u.emailUsuario = (u.emailUsuario || "").trim().toUpperCase();
        if (u.emailUsuario.length < 3 || u.emailUsuario.length > 50)
            return "Email inválido!";
        return null;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select idUsuario, nomeUsuario, senhaUsuario, emailUsuario, telUsuario from usuario order by nomeUsuario asc");
        });
        return (lista || []);
    }
    static async obter(idUsuario) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select idUsuario, nomeUsuario, senhaUsuario, emailUsuario, telUsuario from usuario where idUsuario = ?", [idUsuario]);
        });
        return ((lista && lista[0]) || null);
    }
    static async criar(u) {
        let res;
        if ((res = Usuario.validar(u)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into usuario (nomeUsuario, senhaUsuario, emailUsuario,telUsuario) ) values (?, ?,?,?)", [u.nomeUsuario, u.senhaUsuario, u.emailUsuario, u.telUsuario]);
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `O Usuario "${u.nomeUsuario}" já existe`;
                else
                    throw e;
            }
        });
        return res;
    }
    static async alterar(u) {
        let res;
        if ((res = Usuario.validar(u)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update usuario set nomeUsuario = ?, senhaUsuario = ?, emailUsuario = ?, telUsuario = ? where idUsuario = ?", [u.nomeUsuario, u.senhaUsuario, u.emailUsuario, u.telUsuario, u.idUsuario]);
                if (!sql.linhasAfetadas)
                    res = "Usuário inexistente";
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `O Usuario "${u.nomeUsuario}" já existe`;
                else
                    throw e;
            }
        });
        return res;
    }
    static async excluir(idUsuario) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from usuario where idUsuario = ?", [idUsuario]);
            if (!sql.linhasAfetadas)
                res = "Usuario inexistente";
        });
        return res;
    }
};
//# sourceMappingURL=usuario.js.map