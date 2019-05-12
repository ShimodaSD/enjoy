import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Endereco = require("../../models/endereco");

const router = express.Router();


router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
    let idEnde = parseInt(req.query["idEven"]);
    res.json(isNaN(idEnde) ? null : await Endereco.obter(idEnde));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
    let c = req.body as Endereco;

    if (c) {
        let erro = await Endereco.criar(c);
        if (erro) {
            res.statusCode = 400;
            res.json(erro);
        } else {
            res.sendStatus(204);
        }
    } else {
        res.statusCode = 400;
        res.json("Dados inválidos");
    }

}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
    let e = req.body as Endereco;
    if (e)
        e.idEnde = parseInt(req.body.id);

    if (e && !isNaN(e.idEnde)) {
        let erro = await Endereco.alterar(e);
        if (erro) {
            res.statusCode = 400;
            res.json(erro);
        } else {
            res.sendStatus(204);
        }
    } else {
        res.statusCode = 400;
        res.json("Dados inválidos");
    }

}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
    let idEnde = parseInt(req.query["idEnde"]);

    if (!isNaN(idEnde)) {
        let erro = await Endereco.excluir(idEnde);
        if (erro) {
            res.statusCode = 400;
            res.json(erro);
        } else {
            res.sendStatus(204);
        }
    } else {
        res.statusCode = 400;
        res.json("Dados inválidos");
    }
}));

export = router;
