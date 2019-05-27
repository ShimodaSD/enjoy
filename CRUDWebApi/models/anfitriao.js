"use strict";
const Sql = require("../infra/sql");
module.exports = class Anfitriao {
    static async criar(a) {
        let res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into anfitriao (nomAnfi, mailAnfi, cpfAnfi, senAnfi,latAnfi,lngAnfi) values (?, ?, ?, ?,?,?)", [a.nomAnfi, a.mailAnfi, a.cpfAnfi, a.senAnfi, a.latAnfi, a.lngAnfi]);
            }
            catch (e) {
                res = `Erro`;
            }
        });
        return res;
    }
    static async obter(mailAnfi) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select mailAnfi,senAnfi from anfitriao where mailAnfi=?", [mailAnfi]);
            ;
        });
        return ((lista && lista[0]) || null);
    }
    static validar(a) {
        a.nomAnfi = (a.nomAnfi || "").trim().toUpperCase();
        if (a.nomAnfi.length < 3 || a.nomAnfi.length > 50)
            return "Nome inválido";
        a.mailAnfi = (a.mailAnfi || "").trim().toUpperCase();
        if (a.mailAnfi.length < 7)
            return "E-mail inválido";
        if (a.cpfAnfi.length < 9 || a.cpfAnfi.length > 12)
            return "CPF inválido";
        return null;
    }
    static async alterar(a) {
        let res;
        if ((res = Anfitriao.validar(a)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update atracao set nomAnfi=?, mailAnfi=?, cpfAnfi=?, senAnfi=?  where idAnfi = ?", [a.nomAnfi, a.mailAnfi, a.cpfAnfi, a.senAnfi, a.idAnfi]);
                if (!sql.linhasAfetadas)
                    res = "Anfitriao inexistente";
            }
            catch (a) {
                if (a.code && a.code === "ER_DUP_ENTRY")
                    res = `O Anfitriao "${a.nomAnfi}" já existe`;
                else
                    throw a;
            }
        });
        return res;
    }
    static async excluir(idAnfi) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from anfitriao where idAnfi= ?", [idAnfi]);
            if (!sql.linhasAfetadas)
                res = "Anfitrião inexistente";
        });
        return res;
    }
};
//# sourceMappingURL=anfitriao.js.map