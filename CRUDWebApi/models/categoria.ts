import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class  Categoria {

    public idCate: number
    public nomCate: string

    public static async listar(): Promise<Categoria[]> {
        let lista: Categoria[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select idCate,nomCate from categoria order by idCate asc") as Categoria[];
        });

        return (lista || []);
    }
}