import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Eventos = require("../../models/eventos");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
    res.json(await Eventos.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let idEven = parseInt(req.query["idEven"]);
    res.json(isNaN(idEven) ? null : await Eventos.obter(idEven));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let c = req.body as Eventos;

	if (c) {
		let erro = await Eventos.criar(c);
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
	let e = req.body as Eventos;
    if (e)
        e.idEven = parseInt(req.body.id);

    if (e && !isNaN(e.idEven)) {
		let erro = await Eventos.alterar(e);
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
    let idEven = parseInt(req.query["idEven"]);

    if (!isNaN(idEven)) {
        let erro = await Eventos.excluir(idEven);
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
