"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Candidatura = require("../../models/candidatura");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await Candidatura.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let idCandidato = parseInt(req.query["idCandidatura"]);
    res.json(isNaN(idCandidato) ? null : await Candidatura.obter(idCandidato));
}));
router.post("/criar", wrap(async (req, res) => {
    let c = req.body;
    if (c) {
        let erro = await Candidatura.criar(c);
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
    // O if/else acima ficaria assim com o jsonRes: jsonRes(res, 400, c ? await Curso.criar(c) : "Dados inválidos");
}));
router.post("/alterar", wrap(async (req, res) => {
    let c = req.body;
    if (c)
        c.idCandidatura = parseInt(req.body.id);
    if (c && !isNaN(c.idCandidatura)) {
        let erro = await Candidatura.alterar(c);
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
    // O if/else acima ficaria assim com o jsonRes: jsonRes(res, 400, (c && !isNaN(c.id)) ? await Curso.alterar(c) : "Dados inválidos");
}));
router.get("/excluir", wrap(async (req, res) => {
    let idCandidatura = parseInt(req.query["idCandidatura"]);
    if (!isNaN(idCandidatura)) {
        let erro = await Candidatura.excluir(idCandidatura);
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
    // O if/else acima ficaria assim com o jsonRes: jsonRes(res, 400, !isNaN(id) ? await Curso.excluir(id) : "Dados inválidos");
}));
module.exports = router;
//# sourceMappingURL=candidatura.js.map