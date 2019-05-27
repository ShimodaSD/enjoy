import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Convidado = require("../../models/convidado");

const router = express.Router();


router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
    let mailConv = req.query["mailConv"];
    res.json(!mailConv ? null : await Convidado.obter(mailConv));
}));
router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
    let c = req.body as Convidado;

    if (c) {
        let erro = await Convidado.criar(c);
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
    let e = req.body as Convidado;
    if (e)
        e.idConv = parseInt(req.body.id);

    if (e && !isNaN(e.idConv)) {
        let erro = await Convidado.alterar(e);
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
    let idConv = parseInt(req.query["idConv"]);

    if (!isNaN(idConv)) {
        let erro = await Convidado.excluir(idConv);
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
