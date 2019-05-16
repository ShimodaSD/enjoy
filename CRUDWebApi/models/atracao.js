"use strict";
const Sql = require("../infra/sql");
module.exports = class Atracao {
    static async criar(a) {
        let res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into atracao (idEven,nomAtra,horAtra,idCate,avaAtra) values (?, ?, ?,?,?)", [a.idAtra, a.idEven, a.nomAtra, a.horAtra, a.idCate, a.avaAtra]);
            }
            catch (e) {
                res = `Erro`;
            }
        });
        return res;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select idAtra,idEven,nomAtra,horAtra,avaAtra from atracao order by idEven  asc");
        });
        return (lista || []);
    }
    static async excluir(idAtra) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from atracao where idAtra= ?", [idAtra]);
            if (!sql.linhasAfetadas)
                res = "Atração inexistente";
        });
        return res;
    }
    static async obter(idAtra) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select  idEven,nomAtra,horAtra,avaAtra from atracao where idEven=?", [idAtra]);
            ;
        });
        return ((lista && lista[0]) || null);
    }
    static validar(a) {
        a.nomAtra = (a.nomAtra || "").trim().toUpperCase();
        if (a.nomAtra.length < 3 || a.nomAtra.length > 50)
            return "Nome inválido";
        return null;
    }
    static async alterar(a) {
        let res;
        if ((res = Atracao.validar(a)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update atracao set idEven=?,nomAtra=?,horAtra=?,avaAtra=?  where idAtra = ?", [a.idEven, a.nomAtra, a.horAtra, a.avaAtra, a.idAtra]);
                if (!sql.linhasAfetadas)
                    res = "Atração inexistente";
            }
            catch (a) {
                if (a.code && a.code === "ER_DUP_ENTRY")
                    res = `A Atração "${a.nomAtra}" já existe`;
                else
                    throw a;
            }
        });
        return res;
    }
};
//# sourceMappingURL=atracao.js.map