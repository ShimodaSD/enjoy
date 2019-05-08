"use strict";
const Sql = require("../infra/sql");
const converteData = require("../utils/converteData");
module.exports = class Candidatura {
    static validar(c) {
        c.dataCandidatura = converteData(c.dataCandidatura);
        if (!c.dataCandidatura)
            return "Data inválida!";
        return null;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select idCanditatura, idCandidato, idVaga, date_format(dataCandidatura, '%d/%m/%Y') dataCandidatura from candidatura order by dataCandidatura asc");
        });
        return (lista || []);
    }
    static async obter(idCandidatura) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select c.idCanditatura, ca.idCandidato, v.idVaga, date_format(ca.dataCandidatura, '%d/%m/%Y') dataCandidatura,ca.nomeCandidato,v.nomeVaga from candidatura ca, candidato c, vaga v where ca.idCandidatura = ? and c.idCandidato = ca.idCandidato and v.idVaga = ca.idVaga", [idCandidatura]);
        });
        return ((lista && lista[0]) || null);
    }
    static async criar(c) {
        let res;
        if ((res = Candidatura.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into candidatura (idCandidatura, idCandidato,idVaga, dataCandidatura  ) values (?, ?,?,?)", [c.idCandidatura, c.idCandidato, c.idVaga, c.dataCandidatura]);
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `a data "${c.dataCandidatura}" já existe`;
                else
                    throw e;
            }
        });
        return res;
    }
    static async alterar(c) {
        let res;
        if ((res = Candidatura.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update candidatura set idCandidatura = ?, idCandidato = ?, idVaga = ?,dataCandidatura = ? where idCandidato = ?", [c.idCandidatura, c.idCandidato, c.idVaga, c.dataCandidatura]);
                if (!sql.linhasAfetadas)
                    res = "Candidatura inexistente";
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `A Candidatura "${c.dataCandidatura}" já existe`;
                else
                    throw e;
            }
        });
        return res;
    }
    static async excluir(idCandidatura) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from candidatura where idCandidatura = ?", [idCandidatura]);
            if (!sql.linhasAfetadas)
                res = "Candidato inexistente";
        });
        return res;
    }
};
//# sourceMappingURL=candidatura.js.map