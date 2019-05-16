"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Atracao = require("../../models/atracao");
const router = express.Router();
router.get("/obter", wrap(async (req, res) => {
    let idAtra = parseInt(req.query["idAtra"]);
    res.json(isNaN(idAtra) ? null : await Atracao.obter(idAtra));
}));
router.post("/criar", wrap(async (req, res) => {
    let c = req.body;
    if (c) {
        let erro = await Atracao.criar(c);
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
        e.idAtra = parseInt(req.body.id);
    if (e && !isNaN(e.idAtra)) {
        let erro = await Atracao.alterar(e);
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
    let idAtra = parseInt(req.query["idAtra"]);
    if (!isNaN(idAtra)) {
        let erro = await Atracao.excluir(idAtra);
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
//# sourceMappingURL=atracao.js.map