import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class Usuario  {
	public idUsuario: number;
	public nomeUsuario: string;
	public senhaUsuario: string;
	public emailUsuario: string;
	public telUsuario: string;
	

	public static validar(u: Usuario): string {
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

	public static async listar(): Promise<Usuario[]> {
		let lista: Usuario[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select idUsuario, nomeUsuario, senhaUsuario, emailUsuario, telUsuario from usuario order by nomeUsuario asc") as Usuario[];
		});

		return (lista || []);
	}

	public static async obter(idUsuario: number): Promise<Usuario> {
		let lista: Usuario[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select idUsuario, nomeUsuario, senhaUsuario, emailUsuario, telUsuario from usuario where idUsuario = ?", [idUsuario]) as Usuario[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(u: Usuario): Promise<string> {
		let res: string;
		if ((res = Usuario.validar(u)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("insert into usuario (nomeUsuario, senhaUsuario, emailUsuario,telUsuario) ) values (?, ?,?,?)", [u.nomeUsuario, u.senhaUsuario,u.emailUsuario,u.telUsuario]);
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = `O Usuario "${u.nomeUsuario}" já existe`;
				else
					throw e;
			}
		});

		return res;
	}

	public static async alterar(u: Usuario): Promise<string> {
		let res: string;
		if ((res = Usuario.validar(u)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("update usuario set nomeUsuario = ?, senhaUsuario = ?, emailUsuario = ?, telUsuario = ? where idUsuario = ?", [u.nomeUsuario, u.senhaUsuario,u.emailUsuario, u.telUsuario,u.idUsuario]);
				if (!sql.linhasAfetadas)
					res = "Usuário inexistente";
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = `O Usuario "${u.nomeUsuario}" já existe`;
				else
					throw e;
			}
		});

		return res;
	}

	public static async excluir(idUsuario: number): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from usuario where idUsuario = ?", [idUsuario]);
			if (!sql.linhasAfetadas)
				res = "Usuario inexistente";
		});

		return res;
	}
}
