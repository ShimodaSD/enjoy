"use strict";
const Sql = require("../infra/sql");
module.exports = class Localidade {
    static async criar(l) {
        let res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into endereco (latLoca,lngLoca,nomLoca) values ( ?, ?,?)", [l.latLoca, l.lngLoca, l.nomLoca]);
            }
            catch (l) {
                res = `Erro`;
            }
        });
        return res;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select idLoca,latLoca,lngLoca,nomLoca from localidade order by idLoca  asc");
        });
        return (lista || []);
    }
    static async obter(idLoca) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select idLoca,latLoca,lngLoca,nomLoca from localidade where idLoca=?", [idLoca]);
            ;
        });
        return ((lista && lista[0]) || null);
    }
    static async excluir(idLoca) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from localidade where idLoca= ?", [idLoca]);
            if (!sql.linhasAfetadas)
                res = "Localidade inexistente";
        });
        return res;
    }
    static async alterar(l) {
        let res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update localidade set latLoca,lngLoca where idLoca=?", [l.latLoca, l.lngLoca, l.idLoca]);
                if (!sql.linhasAfetadas)
                    res = "Localidade inexistente";
            }
            catch (l) {
                if (l.code && l.code === "ER_DUP_ENTRY")
                    res = `A Localidade "${l.nomLoca}" já existe`;
                else
                    throw l;
            }
        });
        return res;
    }
    static async markers() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select distinct l.idLoca, l.latLoca, l.lngLoca, l.nomLoca from evento e inner join localidade l on l.idLoca = e.idLoca where e.dataEven = cur_date()");
        });
        return (lista || []);
    }
};
//# sourceMappingURL=localidade.js.map