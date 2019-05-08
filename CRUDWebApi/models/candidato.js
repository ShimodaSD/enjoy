"use strict";
const Sql = require("../infra/sql");
const converteData = require("../utils/converteData");
const Usuario = require("../models/usuario");
module.exports = class Candidato extends Usuario {
    static validar(c) {
        c.nomeCandidato = (c.nomeCandidato || "").trim().toUpperCase();
        if (c.nomeCandidato.length < 3 || c.nomeCandidato.length > 50)
            return "Nome inválido";
        c.enderecoCandidato = (c.enderecoCandidato || "").trim().toUpperCase();
        if (c.enderecoCandidato.length < 1 || c.enderecoCandidato.length > 100)
            return "Descrição inválida";
        c.dataNascimentoCandidato = converteData(c.dataNascimentoCandidato);
        if (!c.dataNascimentoCandidato)
            return "Data inválida!";
        return null;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select c.idCandidato,c.nomeCandidato,date_format(c.dataNascimentoCandidato,'%d/%m/%Y' ) dataNascimentoCandidato, c.enderecoCandidato,u.nomeUsuario, u.emailUsuario, u.telUsuario from candidato c, usuario u where c.idCandidato = u.idUsuario");
        });
        return (lista || []);
    }
    static async obter(idCandidato) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select c.idCandidato, date_format(c.dataNascimentoCandidato,'%d/%m/%Y' ) dataNascimentoCandidato, c.enderecoCandidato,u.idUsuario, u.nomeUsuario, u.emailUsuario, u.telUsuario from candidato c, usuario u where c.idCandidato = u.idUsuario and idCandidato = ?", [idCandidato]);
        });
        return ((lista && lista[0]) || null);
    }
    static async criar(c) {
        let res;
        if ((res = Candidato.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.beginTransaction();
                await sql.query("insert into usuario (nomeUsuario, senhaUsuario, emailUsuario,telUsuario) ) values (?, ?,?,?,?)", [c.nomeCandidato, c.enderecoCandidato, c.dataNascimentoCandidato]);
                c.idCandidato = await sql.scalar("SELECT last_insert_id();");
                await sql.query("insert into candidato (dataNascimentoCandidato, enderecoCandidato, nomeCandidato,idUsuario) ) values (?,?,?,?)", [c.dataNascimentoCandidato, c.enderecoCandidato, c.nomeCandidato, c.idCandidato]);
                await sql.commit();
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `O Candidato "${c.nomeCandidato}" já existe`;
                else
                    throw e;
            }
        });
        return res;
    }
    static async alterar(c) {
        let res;
        if ((res = Candidato.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update candidato set nomeCandidato = ?, dataNascimento = ?, enderecoCandidato = ? where idCandidato = ?", [c.nomeCandidato, c.dataNascimentoCandidato, c.enderecoCandidato, c.idCandidato]);
                if (!sql.linhasAfetadas)
                    res = "Candidato inexistente";
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `O Candidato "${c.nomeCandidato}" já existe`;
                else
                    throw e;
            }
        });
        return res;
    }
    static async excluir(idCandidato) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from candidato where idCandidato = ?", [idCandidato]);
            if (!sql.linhasAfetadas)
                res = "Candidato inexistente";
        });
        return res;
    }
};
//# sourceMappingURL=candidato.js.map