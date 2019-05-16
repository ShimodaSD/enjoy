"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Localidade = require("../../models/localidade");
const router = express.Router();
router.get("/obter", wrap(async (req, res) => {
    let idLoca = parseInt(req.query["idLoca"]);
    res.json(isNaN(idLoca) ? null : await Localidade.obter(idLoca));
}));
router.post("/criar", wrap(async (req, res) => {
    let c = req.body;
    if (c) {
        let erro = await Localidade.criar(c);
        if (erro) {
            res.statusCode = 400;
            res.json(erro);
        }
        else {
            res.sendStatus(204);
        }
    }
    else {
        res.statusCode = 400;
        res.json("Dados inválidos");
    }
}));
router.post("/alterar", wrap(async (req, res) => {
    let e = req.body;
    if (e)
        e.idLoca = parseInt(req.body.id);
    if (e && !isNaN(e.idLoca)) {
        let erro = await Localidade.alterar(e);
        if (erro) {
            res.statusCode = 400;
            res.json(erro);
        }
        else {
            res.sendStatus(204);
        }
    }
    else {
        res.statusCode = 400;
        res.json("Dados inválidos");
    }
}));
router.get("/excluir", wrap(async (req, res) => {
    let idLoca = parseInt(req.query["idLoca"]);
    if (!isNaN(idLoca)) {
        let erro = await Localidade.excluir(idLoca);
        if (erro) {
            res.statusCode = 400;
            res.json(erro);
        }
        else {
            res.sendStatus(204);
        }
    }
    else {
        res.statusCode = 400;
        res.json("Dados inválidos");
    }
}));
module.exports = router;
//# sourceMappingURL=localidade.js.map