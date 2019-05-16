import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class Localidade {

    public idLoca: number
    public nomLoca: string
    public latLoca: string
    public lngLoca: string


    public static async criar(l: Localidade): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into endereco (latLoca,lngLoca,nomLoca) values ( ?, ?,?)", [l.latLoca, l.lngLoca,l.nomLoca]);
            } catch (l) {
                res = `Erro`;

            }
        });

        return res;
    }

    public static async listar(): Promise<Localidade[]> {
        let lista: Localidade[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select idLoca,latLoca,lngLoca,nomLoca from localidade order by idLoca  asc") as Localidade[];
        });

        return (lista || []);
    }

    public static async obter(idLoca: number): Promise<Localidade> {
        let lista: Localidade[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select idLoca,latLoca,lngLoca,nomLoca from localidade where idLoca=?", [idLoca]) as Localidade[];;
        });

        return ((lista && lista[0]) || null);
    }

    public static async excluir(idLoca: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from localidade where idLoca= ?", [idLoca]);
            if (!sql.linhasAfetadas)
                res = "Localidade inexistente";
        });

        return res;
    }



    public static async alterar(l: Localidade): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update localidade set latLoca,lngLoca where idLoca=?", [l.latLoca, l.lngLoca, l.idLoca]);
                if (!sql.linhasAfetadas)
                    res = "Localidade inexistente";
            } catch (l) {
                if (l.code && l.code === "ER_DUP_ENTRY")
                    res = `A Localidade "${l.nomLoca}" já existe`;
                else
                    throw l;
            }
        });

        return res;
    }

    public static async listarHoje(): Promise<Localidade[]> {
        let lista: Localidade[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select distinct l.idLoca, l.latLoca, l.lngLoca, l.nomLoca from evento e inner join localidade l on l.idLoca = e.idLoca where e.dataEven = curdate()") as Localidade[];
        });

        return (lista || []);
    }

}