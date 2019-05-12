import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Categoria = require("../../models/categoria");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
    res.json(await Categoria.listar());
}));