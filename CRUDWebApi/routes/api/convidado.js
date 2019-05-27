"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Convidado = require("../../models/convidado");
const router = express.Router();
router.get("/obter", wrap(async (req, res) => {
    let mailConv = req.query["mailConv"];
    res.json(!mailConv ? null : await Convidado.obter(mailConv));
}));
router.post("/criar", wrap(async (req, res) => {
    let c = req.body;
    if (c) {
        let erro = await Convidado.criar(c);
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
        e.idConv = parseInt(req.body.id);
    if (e && !isNaN(e.idConv)) {
        let erro = await Convidado.alterar(e);
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
    let idConv = parseInt(req.query["idConv"]);
    if (!isNaN(idConv)) {
        let erro = await Convidado.excluir(idConv);
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
//# sourceMappingURL=convidado.js.map