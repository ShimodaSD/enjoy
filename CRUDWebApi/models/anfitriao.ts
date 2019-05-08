import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class  Afintriao {

    public idAnfi: number
    public nomAnfi: String
    public mailAnfi: String
    public cpfAnfi: String
    public senAnfi: String



    public static async criar(a: Anfitriao): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into anfitriao (nomAnfi, mailAnfi, cpfAnfi, senAnfi) values (?, ?, ?, ?)", [a.nomAnfi, a.mailAnfi, a.cpfAnfi, a.senAnfi]);
            } catch (e) {
                res = `Erro`;

            }
        });

        return res;
    }
}