import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Candidato = require("../../models/candidato");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await Candidato.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let idCandidato = parseInt(req.query["idCandidato"]);
	res.json(isNaN(idCandidato) ? null : await Candidato.obter(idCandidato));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let c = req.body as Candidato;

	if (c) {
		let erro = await Candidato.criar(c);
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
	let c = req.body as Candidato;
	if (c)
		c.idCandidato = parseInt(req.body.id);

	if (c && !isNaN(c.idCandidato)) {
		let erro = await Candidato.alterar(c);
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
	let idCandidato = parseInt(req.query["idCandidato"]);

	if (!isNaN(idCandidato)) {
		let erro = await Candidato.excluir(idCandidato);
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
