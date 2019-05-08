import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");


export = class Candidatura {
	public idCandidatura: number;
	public idCandidato: number;
	public idVaga: number;
	public nomeCandidato: string;
	public nomeVaga: string;
	public dataCandidatura: string;
	

	private static validar(c: Candidatura): string {
		c.dataCandidatura = converteData(c.dataCandidatura);
		if (!c.dataCandidatura)
			return "Data inválida!";
		return null;
	}

	public static async listar(): Promise<Candidatura[]> {
		let lista: Candidatura[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select idCanditatura, idCandidato, idVaga, date_format(dataCandidatura, '%d/%m/%Y') dataCandidatura from candidatura order by dataCandidatura asc") as Candidatura[];
		});

		return (lista || []);
	}

	public static async obter(idCandidatura: number): Promise<Candidatura> {
		let lista: Candidatura[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select c.idCanditatura, ca.idCandidato, v.idVaga, date_format(ca.dataCandidatura, '%d/%m/%Y') dataCandidatura,ca.nomeCandidato,v.nomeVaga from candidatura ca, candidato c, vaga v where ca.idCandidatura = ? and c.idCandidato = ca.idCandidato and v.idVaga = ca.idVaga", [idCandidatura]) as Candidatura[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(c: Candidatura): Promise<string> {
		let res: string;
		if ((res = Candidatura.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("insert into candidatura (idCandidatura, idCandidato,idVaga, dataCandidatura  ) values (?, ?,?,?)", [c.idCandidatura, c.idCandidato,c.idVaga,c.dataCandidatura]);
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = `a data "${c.dataCandidatura}" já existe`;
				else
					throw e;
			}
		});

		return res;
	}

	public static async alterar(c: Candidatura): Promise<string> {
		let res: string;
		if ((res = Candidatura.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("update candidatura set idCandidatura = ?, idCandidato = ?, idVaga = ?,dataCandidatura = ? where idCandidato = ?", [c.idCandidatura, c.idCandidato,c.idVaga, c.dataCandidatura]);
				if (!sql.linhasAfetadas)
					res = "Candidatura inexistente";
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = `A Candidatura "${c.dataCandidatura}" já existe`;
				else
					throw e;
			}
		});

		return res;
	}

	public static async excluir(idCandidatura: number): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from candidatura where idCandidatura = ?", [idCandidatura]);
			if (!sql.linhasAfetadas)
				res = "Candidato inexistente";
		});

		return res;
	}
}
