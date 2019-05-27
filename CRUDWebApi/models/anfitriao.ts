import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class  Anfitriao {

    public idAnfi: number
    public nomAnfi: string
    public mailAnfi: string
    public cpfAnfi: string
    public senAnfi: string   
    public latAnfi: string
    public lngAnfi: string



    public static async criar(a: Anfitriao): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into anfitriao (nomAnfi, mailAnfi, cpfAnfi, senAnfi,latAnfi,lngAnfi) values (?, ?, ?, ?,?,?)", [a.nomAnfi, a.mailAnfi, a.cpfAnfi, a.senAnfi, a.latAnfi, a.lngAnfi]);
            } catch (e) {   
                res = `Erro`;

            }
        });

        return res;
    }

    public static async obter(mailAnfi: string): Promise<Anfitriao> {
        let lista: Anfitriao[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select mailAnfi,senAnfi from anfitriao where mailAnfi=?", [mailAnfi]) as Anfitriao[];;
        });

        return ((lista && lista[0]) || null);
    }

    public static validar(a: Anfitriao): string {
        a.nomAnfi = (a.nomAnfi || "").trim().toUpperCase();
        if (a.nomAnfi.length < 3 || a.nomAnfi.length > 50)
            return "Nome inválido";
        a.mailAnfi = (a.mailAnfi || "").trim().toUpperCase();
        if (a.mailAnfi.length < 7)
            return "E-mail inválido";
        if (a.cpfAnfi.length < 9 || a.cpfAnfi.length > 12)
            return "CPF inválido";
        return null;
    }

    public static async alterar(a: Anfitriao): Promise<string> {
        let res: string;
        if ((res = Anfitriao.validar(a)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update atracao set nomAnfi=?, mailAnfi=?, cpfAnfi=?, senAnfi=?  where idAnfi = ?", [a.nomAnfi, a.mailAnfi, a.cpfAnfi, a.senAnfi, a.idAnfi]);
                if (!sql.linhasAfetadas)
                    res = "Anfitriao inexistente";
            } catch (a) {
                if (a.code && a.code === "ER_DUP_ENTRY")
                    res = `O Anfitriao "${a.nomAnfi}" já existe`;
                else
                    throw a;
            }
        });

        return res;
    }

    public static async excluir(idAnfi: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from anfitriao where idAnfi= ?", [idAnfi]);
            if (!sql.linhasAfetadas)
                res = "Anfitrião inexistente";
        });

        return res;
    }


}