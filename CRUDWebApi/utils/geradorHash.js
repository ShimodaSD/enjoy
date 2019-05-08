"use strict";
var _a;
const crypto_1 = require("crypto");
module.exports = (_a = class GeradorHash {
        static async criarHash(senha) {
            return new Promise((resolve, reject) => {
                var salt = crypto_1.randomBytes(GeradorHash.SALT_BYTE_SIZE);
                crypto_1.pbkdf2(Buffer.from(senha), salt, 1024, GeradorHash.HASH_BYTE_SIZE, "sha512", (err, derivedKey) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(derivedKey.toString("base64") + ":" + salt.toString("base64"));
                });
            });
        }
        static async validarSenha(senha, hash) {
            return new Promise((resolve, reject) => {
                var i;
                if (!senha || !hash || (i = hash.indexOf(":")) <= 0) {
                    resolve(false);
                    return;
                }
                var senhaHash = hash.substring(0, i);
                var saltHash = hash.substring(i + 1);
                if (!senhaHash || !saltHash) {
                    resolve(false);
                    return;
                }
                crypto_1.pbkdf2(Buffer.from(senha), Buffer.from(saltHash, "base64"), 1024, GeradorHash.HASH_BYTE_SIZE, "sha512", (err, derivedKey) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(derivedKey.toString("base64") === senhaHash);
                });
            });
        }
    },
    _a.SALT_BYTE_SIZE = 33,
    _a.HASH_BYTE_SIZE = 33,
    _a);
//# sourceMappingURL=geradorHash.js.map