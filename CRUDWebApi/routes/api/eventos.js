"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Eventos = require("../../models/eventos");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await Eventos.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let idEven = parseInt(req.query["idEven"]);
    res.json(isNaN(idEven) ? null : await Eventos.obter(idEven));
}));
router.post("/criar", wrap(async (req, res) => {
    let c = req.body;
    if (c) {
        let erro = await Eventos.criar(c);
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
        e.idEven = parseInt(req.body.id);
    if (e && !isNaN(e.idEven)) {
        let erro = await Eventos.alterar(e);
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
    let idEven = parseInt(req.query["idEven"]);
    if (!isNaN(idEven)) {
        let erro = await Eventos.excluir(idEven);
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
//# sourceMappingURL=eventos.js.map