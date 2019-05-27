import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class Eventos {

    public idEven: number
    public idEnde: number
    public nomeEven: string
    public dataEven: string
    public avalEven: number
    public horaEven: string
    public idAnfi: number
    public latEven: string
    public lngEven: string

    public static async criar(e: Eventos): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into eventos (idEnde,nomeEnve, dataEven, avalEven, horaEven,idAnfi,latEven,lngEven) values (?, ?, ?, ?,?,?,?,?)", [e.idEnde, e.nomeEven, e.dataEven, e.avalEven, e.horaEven, e.idAnfi, e.latEven, e.lngEven]);
            } catch (e) {
                res = `Erro`;
            }
        });

        return res;
    }

    public static async listar(): Promise<Eventos[]> {
        let lista: Eventos[] = null;
        await Sql.conectar(async (sql: Sql) => {
            //lista = await sql.query("select latEven,lngEven,horaEven,dataEven,nomeEven from eventos where dataEven=? ", [dataEven]);
            lista = await sql.query("select e.idEnde,e.nomeEnve, e.dataEven, e.avalEven, e.horaEven,e.idAnfi from eventos e,anfitria a,endereco en where e.idAnfi = a.idAnfi e.idEnde = en.idEnde order by idEven  asc") as Eventos[];
        });

        return (lista || []);
    }

    public static async alterar(e: Eventos): Promise<string> {
        let res: string;
        if ((res = Eventos.validar(e)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update eventos set idEnde = ?, nomeEnve = ?, dataEven = ?,horaEven=? where idEven = ?", [e.idEnde, e.nomeEven, e.dataEven, e.horaEven, e.idEven]);
                if (!sql.linhasAfetadas)
                    res = "Candidato inexistente";
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `O Evento "${e.nomeEven}" já existe`;
                else
                    throw e;
            }
        });

        return res;
    }

    public static validar(e: Eventos): string {
        e.nomeEven = (e.nomeEven || "").trim().toUpperCase();
        if (e.nomeEven.length < 3 || e.nomeEven.length > 50)
            return "Nome inválido";
        e.dataEven = converteData(e.dataEven);
        if (!e.dataEven)
            return "Data inválida!";
        return null;


    }

    public static async excluir(idEven: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from eventos where idEven= ?", [idEven]);
            if (!sql.linhasAfetadas)
                res = "Candidato inexistente";
        });

        return res;
    }
    public static async obter(idEven: number): Promise<Eventos> {
        let lista: Eventos[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select idEnde,nomeEnve, dataEven, avalEven, horaEven,idAnfi from eventos e,anfitria a where e.idAnfi = a.idAnfi and idEven=?", [idEven]) as Eventos[]; ;
        });

        return ((lista && lista[0]) || null);
    }

}