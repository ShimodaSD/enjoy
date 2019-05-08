import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Usuario = require("../../models/usuario");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await Usuario.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let idUsuario = parseInt(req.query["idUsuario"]);
	res.json(isNaN(idUsuario) ? null : await Usuario.obter(idUsuario));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = req.body as Usuario;

	if (u) {
		let erro = await Usuario.criar(u);
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

	// O if/else acima ficaria assim com o jsonRes: jsonRes(res, 400, c ? await Curso.criar(c) : "Dados inválidos");
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = req.body as Usuario;
	if (u)
		u.idUsuario = parseInt(req.body.id);

	if (u && !isNaN(u.idUsuario)) {
		let erro = await Usuario.alterar(u);
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

	// O if/else acima ficaria assim com o jsonRes: jsonRes(res, 400, (c && !isNaN(c.id)) ? await Curso.alterar(c) : "Dados inválidos");
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let idUsuario = parseInt(req.query["idUsuario"]);

	if (!isNaN(idUsuario)) {
		let erro = await Usuario.excluir(idUsuario);
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

	// O if/else acima ficaria assim com o jsonRes: jsonRes(res, 400, !isNaN(id) ? await Curso.excluir(id) : "Dados inválidos");
}));

export = router;
