import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Atracao = require("../../models/atracao");

const router = express.Router();


router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
    let idAtra = parseInt(req.query["idAtra"]);
    res.json(isNaN(idAtra) ? null : await Atracao.obter(idAtra));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
    let c = req.body as Atracao;

    if (c) {
        let erro = await Atracao.criar(c);
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
    let e = req.body as Atracao;
    if (e)
        e.idAtra = parseInt(req.body.id);

    if (e && !isNaN(e.idAtra)) {
        let erro = await Atracao.alterar(e);
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
    let idAtra = parseInt(req.query["idAtra"]);

    if (!isNaN(idAtra)) {
        let erro = await Atracao.excluir(idAtra);
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
