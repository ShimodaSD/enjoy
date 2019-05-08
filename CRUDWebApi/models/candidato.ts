import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");
import Usuario = require("../models/usuario")

export = class Candidato extends Usuario {
	public idCandidato: number;
	public nomeCandidato: string;
	public dataNascimentoCandidato: string;
	public enderecoCandidato: string;
	

	public static validar(c: Candidato): string {
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

	public static async listar(): Promise<Candidato[]> {
		let lista: Candidato[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select u.idUsuario,c.idCandidato,c.nomeCandidato,date_format(c.dataNascimentoCandidato,'%d/%m/%Y' ) dataNascimentoCandidato, c.enderecoCandidato,u.nomeUsuario, u.emailUsuario, u.telUsuario from candidato c, usuario u where c.idCandidato = u.idUsuario") as Candidato[];
		});

		return (lista || []);
	}

	public static async obter(idCandidato: number): Promise<Candidato> {
		let lista: Candidato[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select u.idUsuario, c.idCandidato, date_format(c.dataNascimentoCandidato,'%d/%m/%Y' ) dataNascimentoCandidato, c.enderecoCandidato,u.nomeUsuario, u.emailUsuario, u.telUsuario from candidato c, usuario u where c.idCandidato = u.idUsuario and idCandidato = ?", [idCandidato]) as Candidato[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(c: Candidato): Promise<string> {
		let res: string;
		if ((res = Candidato.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.beginTransaction();
				await sql.query("insert into usuario (nomeUsuario, senhaUsuario, emailUsuario,telUsuario) ) values (?, ?,?,?,?)", [c.nomeCandidato, c.enderecoCandidato,c.dataNascimentoCandidato]);
				c.idCandidato = await sql.scalar("SELECT last_insert_id();") as number;
				await sql.query("insert into candidato (dataNascimentoCandidato, enderecoCandidato, nomeCandidato,idUsuario) ) values (?,?,?,?)", [c.dataNascimentoCandidato, c.enderecoCandidato,c.nomeCandidato,c.idCandidato]);
				await sql.commit();
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = `O Candidato "${c.nomeCandidato}" já existe`;
				else
					throw e;
			}
		});

		return res;
	}

	public static async alterar(c: Candidato): Promise<string> {
		let res: string;
		if ((res = Candidato.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("update candidato set nomeCandidato = ?, dataNascimento = ?, enderecoCandidato = ? where idCandidato = ?", [c.nomeCandidato,c.dataNascimentoCandidato, c.enderecoCandidato,c.idCandidato]);
				if (!sql.linhasAfetadas)
					res = "Candidato inexistente";
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = `O Candidato "${c.nomeCandidato}" já existe`;
				else
					throw e;
			}
		});

		return res;
	}

	public static async excluir(idCandidato: number): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from candidato where idCandidato = ?", [idCandidato]);
			if (!sql.linhasAfetadas)
				res = "Candidato inexistente";
		});

		return res;
	}
}
