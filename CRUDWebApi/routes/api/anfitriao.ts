import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Anfitriao = require("../../models/anfitriao");

const router = express.Router();


router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
    let mailAnfi = parseInt(req.query["mailAnfi"]);
    res.json(isNaN(mailAnfi) ? null : await Anfitriao.obter(mailAnfi));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
    let c = req.body as Anfitriao;

    if (c) {
        let erro = await Anfitriao.criar(c);
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
    let e = req.body as Anfitriao;
    if (e)
        e.idAnfi = parseInt(req.body.id);

    if (e && !isNaN(e.idAnfi)) {
        let erro = await Anfitriao.alterar(e);
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
    let idAnfi = parseInt(req.query["idAnfi"]);

    if (!isNaN(idAnfi)) {
        let erro = await Anfitriao.excluir(idAnfi);
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
