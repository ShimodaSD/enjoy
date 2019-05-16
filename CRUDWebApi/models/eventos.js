"use strict";
const Sql = require("../infra/sql");
const converteData = require("../utils/converteData");
module.exports = class Eventos {
    static async criar(e) {
        let res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into eventos (idEnde,nomeEnve, dataEven, avalEven, horaEven,idAnfi) values (?, ?, ?, ?,?,?)", [e.idEnde, e.nomeEven, e.dataEven, e.avalEven, e.horaEven, e.idAnfi]);
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
            lista = await sql.query("select e.idEnde,e.nomeEnve, e.dataEven, e.avalEven, e.horaEven,e.idAnfi from eventos e,anfitria a,endereco en where e.idAnfi = a.idAnfi e.idEnde = en.idEnde order by idEven  asc");
        });
        return (lista || []);
    }
    static async alterar(e) {
        let res;
        if ((res = Eventos.validar(e)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update eventos set idEnde = ?, nomeEnve = ?, dataEven = ?,horaEven=? where idEven = ?", [e.idEnde, e.nomeEven, e.dataEven, e.horaEven, e.idEven]);
                if (!sql.linhasAfetadas)
                    res = "Candidato inexistente";
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `O Evento "${e.nomeEven}" já existe`;
                else
                    throw e;
            }
        });
        return res;
    }
    static validar(e) {
        e.nomeEven = (e.nomeEven || "").trim().toUpperCase();
        if (e.nomeEven.length < 3 || e.nomeEven.length > 50)
            return "Nome inválido";
        e.dataEven = converteData(e.dataEven);
        if (!e.dataEven)
            return "Data inválida!";
        return null;
    }
    static async excluir(idEven) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from eventos where idEven= ?", [idEven]);
            if (!sql.linhasAfetadas)
                res = "Candidato inexistente";
        });
        return res;
    }
    static async obter(idEven) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select idEnde,nomeEnve, dataEven, avalEven, horaEven,idAnfi from eventos e,anfitria a where e.idAnfi = a.idAnfi and idEven=?", [idEven]);
            ;
        });
        return ((lista && lista[0]) || null);
    }
};
//# sourceMappingURL=eventos.js.map