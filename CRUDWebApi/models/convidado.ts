import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class  Convidado {

    public idConv: number
    public nomeConv: string
    public dtconv: string
    public genConv: string
    public mailConv: string
    public senConv: string



    public static async criar(c: Convidado): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into convidado (nomeConv,date_format(c.dtconv,'%d/%m/%Y' ) dtConv,genConv,mailConv,senConv) values ( ?, ?, ?,?,?)", [c.nomeConv, c.dtconv, c.genConv, c.mailConv, c.senConv]);
            } catch (e) {
                res = `Erro`;

            }
        });

        return res;
    }
}
