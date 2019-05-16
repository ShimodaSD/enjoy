"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Anfitriao = require("../../models/anfitriao");
const router = express.Router();
router.get("/obter", wrap(async (req, res) => {
    let idAnfi = parseInt(req.query["idAnfi"]);
    res.json(isNaN(idAnfi) ? null : await Anfitriao.obter(idAnfi));
}));
router.post("/criar", wrap(async (req, res) => {
    let c = req.body;
    if (c) {
        let erro = await Anfitriao.criar(c);
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
        e.idAnfi = parseInt(req.body.id);
    if (e && !isNaN(e.idAnfi)) {
        let erro = await Anfitriao.alterar(e);
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
    let idAnfi = parseInt(req.query["idAnfi"]);
    if (!isNaN(idAnfi)) {
        let erro = await Anfitriao.excluir(idAnfi);
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
//# sourceMappingURL=anfitriao.js.map