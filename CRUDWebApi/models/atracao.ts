import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class Atracao {

    public idAtra: number
    public idEven: number
    public nomAtra: String
    public horAtra: String
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
}
