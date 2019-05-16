"use strict";
const Sql = require("../infra/sql");
module.exports = class Categoria {
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select idCate,nomCate from categoria order by idCate asc");
        });
        return (lista || []);
    }
};
//# sourceMappingURL=categoria.js.map