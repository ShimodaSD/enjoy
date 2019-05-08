"use strict";
module.exports = function jsonRes(res, statusCodeFalha, resultado) {
    let r;
    if (!resultado) {
        res.sendStatus(204);
    }
    else {
        res.statusCode = statusCodeFalha;
        res.json(resultado);
    }
};
//# sourceMappingURL=jsonRes.js.map