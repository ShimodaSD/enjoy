import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Localidade = require("../../models/localidade");

const router = express.Router();


router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
    let idLoca = parseInt(req.query["idLoca"]);
    res.json(isNaN(idLoca) ? null : await Localidade.obter(idLoca));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
    let c = req.body as Localidade;

    if (c) {
        let erro = await Localidade.criar(c);
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
    let e = req.body as Localidade;
    if (e)
        e.idLoca = parseInt(req.body.id);

    if (e && !isNaN(e.idLoca)) {
        let erro = await Localidade.alterar(e);
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
    let idLoca = parseInt(req.query["idLoca"]);

    if (!isNaN(idLoca)) {
        let erro = await Localidade.excluir(idLoca);
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

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
    res.json(await Localidade.listar());
}));

router.get("/listarHoje", wrap(async (req: express.Request, res: express.Response) => {
    res.json(await Localidade.listarHoje());
}));

export = router;
