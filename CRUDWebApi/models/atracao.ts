import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class Atracao {

    public idAtra: number
    public idEven: number
    public nomAtra: string
    public horAtra: string
    public idCate: number
    public avaAtra: number

    public static async criar(a: Atracao): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into atracao (idEven,nomAtra,horAtra,idCate,avaAtra) values (?, ?, ?,?,?)", [a.idAtra, a.idEven, a.nomAtra, a.horAtra, a.idCate, a.avaAtra]);
            } catch (e) {
                res = `Erro`;

            }
        });

        return res;
    }

    public static async listar(): Promise<Atracao[]> {
        let lista: Atracao[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select idAtra,idEven,nomAtra,horAtra,avaAtra from atracao order by idEven  asc") as Atracao[];
        });

        return (lista || []);
    }

    public static async excluir(idAtra: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from atracao where idAtra= ?", [idAtra]);
            if (!sql.linhasAfetadas)
                res = "Atração inexistente";
        });

        return res;
    }

    public static async obter(idAtra: number): Promise<Atracao> {
        let lista: Atracao[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select  idEven,nomAtra,horAtra,avaAtra from atracao where idEven=?", [idAtra]) as Atracao[];;
        });

        return ((lista && lista[0]) || null);
    }

    public static validar(a: Atracao): string {
        a.nomAtra = (a.nomAtra || "").trim().toUpperCase();
        if (a.nomAtra.length < 3 || a.nomAtra.length > 50)
            return "Nome inválido";
        return null;
    }

    public static async alterar(a: Atracao): Promise<string> {
        let res: string;
        if ((res = Atracao.validar(a)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update atracao set idEven=?,nomAtra=?,horAtra=?,avaAtra=?  where idAtra = ?", [a.idEven, a.nomAtra, a.horAtra, a.avaAtra, a.idAtra ]);
                if (!sql.linhasAfetadas)
                    res = "Atração inexistente";
            } catch (a) {
                if (a.code && a.code === "ER_DUP_ENTRY")
                    res = `A Atração "${a.nomAtra}" já existe`;
                else
                    throw a;
            }
        });

        return res;
    }

}
