"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Categoria = require("../../models/categoria");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await Categoria.listar());
}));
module.exports = router;
//# sourceMappingURL=categoria.js.map