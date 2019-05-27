"use strict";
const Sql = require("../infra/sql");
const converteData = require("../utils/converteData");
module.exports = class Convidado {
    static async criar(c) {
        let res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into convidado (nomeConv,dtConv,genConv,mailConv,senConv) values ( ?, ?, ?,?,?)", [c.nomeConv, c.dtConv, c.genConv, c.mailConv, c.senConv]);
            }
            catch (e) {
                res = `Erro`;
            }
        });
        return res;
    }
    static async obter(mailConv) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select mailConv,senConv from convidado where  mailConv = ?", [mailConv]);
        });
        return ((lista && lista[0]) || null);
    }
    static async excluir(idConv) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from convidado where idConv = ?", [idConv]);
            if (!sql.linhasAfetadas)
                res = "Candidato inexistente";
        });
        return res;
    }
    static async alterar(c) {
        let res;
        if ((res = Convidado.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update convidado nomeConv=?,dtConv=?,genConv=?,mailConv=?,senConv=? where idConv = ?", [c.nomeConv, c.dtConv, c.genConv, c.mailConv, c.senConv, c.idConv]);
                if (!sql.linhasAfetadas)
                    res = "Convidado inexistente";
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `O Convidado "${e.nomeConv}" já existe`;
                else
                    throw e;
            }
        });
        return res;
    }
    static validar(c) {
        c.nomeConv = (c.nomeConv || "").trim().toUpperCase();
        if (c.nomeConv.length < 3 || c.nomeConv.length > 50)
            return "Nome inválido";
        c.dtConv = converteData(c.dtConv);
        if (!c.dtConv)
            return "Data inválida!";
        c.mailConv = (c.mailConv || "").trim().toUpperCase();
        if (c.mailConv.length < 7)
            return "E-mail inválido";
        return null;
    }
};
//# sourceMappingURL=convidado.js.map