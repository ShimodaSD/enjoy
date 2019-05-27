import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class  Convidado {

    public idConv: number
    public nomeConv: string
    public dtConv: string
    public genConv: string
    public mailConv: string
    public senConv: string



    public static async criar(c: Convidado): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into convidado (nomeConv,dtConv,genConv,mailConv,senConv) values ( ?, ?, ?,?,?)", [c.nomeConv, c.dtConv, c.genConv, c.mailConv, c.senConv]);
            } catch (e) {
                res = `Erro`;

            }
        });

        return res;
    }

    public static async obter(mailConv: string): Promise<Convidado> {
        let lista: Convidado[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select mailConv,senConv from convidado where  mailConv = ?", [mailConv]) as Convidado[];
        });

        return ((lista && lista[0]) || null);
    }

    public static async excluir(idConv: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from convidado where idConv = ?", [idConv]);
            if (!sql.linhasAfetadas)
                res = "Candidato inexistente";
        });

        return res;
    }

    public static async alterar(c: Convidado): Promise<string> {
        let res: string;
        if ((res = Convidado.validar(c)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update convidado nomeConv=?,dtConv=?,genConv=?,mailConv=?,senConv=? where idConv = ?", [c.nomeConv, c.dtConv, c.genConv, c.mailConv, c.senConv, c.idConv]);
                if (!sql.linhasAfetadas)
                    res = "Convidado inexistente";
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = `O Convidado "${e.nomeConv}" já existe`;
                else
                    throw e;
            }
        });

        return res;
    }
    public static validar(c: Convidado): string {
        c.nomeConv = (c.nomeConv || "").trim().toUpperCase();
        if (c.nomeConv.length < 3 || c.nomeConv.length > 50)
            return "Nome inválido";
        c.dtConv = converteData(c.dtConv);
        if (!c.dtConv)
            return "Data inválida!";
         c.mailConv = (c.mailConv || "").trim().toUpperCase();
        if (c.mailConv.length < 7)
            return "E-mail inválido";
        return null;
    }
}
