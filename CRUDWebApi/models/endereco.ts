import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class Endereco {

    public idEnde: number
    public latEnde: string
    public lngEnde: string


    public static async criar(e: Endereco): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into endereco (latEnde,lngEnde) values ( ?, ?)", [e.latEnde, e.lngEnde]);
            } catch (e) {
                res = `Erro`;

            }
        });

        return res;
    }

    public static async listar(): Promise<Endereco[]> {
        let lista: Endereco[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select idEnde,latEnde,lngEnde from endereco order by idEnde  asc") as Endereco[];
        });

        return (lista || []);
    }

    public static async obter(idEnde: number): Promise<Endereco> {
        let lista: Endereco[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select idEnde,latEnde,lngEnde from endereco idEnde=?", [idEnde]) as Endereco[];;
        });

        return ((lista && lista[0]) || null);
    }

    public static async excluir(idEnde: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from endereco where idEnde= ?", [idEnde]);
            if (!sql.linhasAfetadas)
                res = "Endereço inexistente";
        });

        return res;
    }

}