"use strict";
//****************************************************************
// Logo ao abrir o projeto podem aparecer alguns erros nesse
// código, bem como nas dependências do Solution Explorer!
// É normal que isso ocorra, até que o processo de carregamento
// (exibido no canto inferior esquerdo) tenha avançado!
//****************************************************************
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const cookieParser = require("cookie-parser"); // https://stackoverflow.com/a/16209531/3569421
const path = require("path");
express();
const app = express();
// Não queremos o header X-Powered-By
app.disable("x-powered-by");
app.use(cookieParser());
//import Usuario = require("./models/usuario");
// Parei de usar Usuario.pegarDoCookie como middleware, porque existem muitas requests
// que não precisam validar o usuário logado...
//app.use(Usuario.pegarDoCookie); // Coloca o parser de usuário depois do cookie, pois ele usa os cookies
// Explica para o express qual será o diretório de onde serviremos os
// arquivos estáticos (js, css, imagens etc...)
app.use(express.static(path.join(__dirname, "public"), {
    cacheControl: true,
    etag: false,
    maxAge: "30d"
}));
app.use(express.json()); // http://expressjs.com/en/api.html#express.json
app.use(express.urlencoded({ extended: true })); // http://expressjs.com/en/api.html#express.urlencoded
// Configura o diretório de onde tirar as views
app.set("views", path.join(__dirname, "views"));
// Nosso middleware para evitar cache das páginas e api
// (deixa depois do static, pois os arquivos static devem usar cache e coisas)
app.use((req, res, next) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
});
// Especifica quais módulos serão responsáveis por servir cada rota,
// a partir dos endereços requisitados pelo cliente
//
// A string no primeiro parâmetro representa o começo do caminho
// requisitado. Vamos ver alguns exemplos de caminhos, e como eles
// seriam tratados pelo Express
//
// Caminho completo   Caminho do tratador   Tratador e resultado
// /                  /                     index (OK)
// /usuario           /                     usuario (OK)
// /usuario/novo      /novo                 usuario (OK)
// /usuario/alterar   /alterar              usuario (Erro, não temos /alterar em usuario)
// /outra             /outra                index (OK)
// /usuarioteste      /usuarioteste         index (Erro, não temos /usuarioteste em index)
//
// https://expressjs.com/en/guide/routing.html
// API
app.use("/api/anfitriao", require("./routes/api/anfitriao"));
app.use("/api/atracao", require("./routes/api/atracao"));
app.use("/api/categoria", require("./routes/api/categoria"));
app.use("/api/convidado", require("./routes/api/convidado"));
app.use("/api/eventos", require("./routes/api/eventos"));
// Depois de registrados todos os caminhos das rotas e seus
// tratadores, registramos os tratadores que serão chamados
// caso nenhum dos tratadores anteriores tenha devolvido alguma
// resposta
//
// O Express diferencia um tratador regular (como esse aqui) de um tratador
// de erros, como os dois abaixo, pela quantidade de parâmetros!!!
//
// Isso é possível, porque em JavaScript, f.length retorna a quantidade
// de parâmetros declarados na função f!!!
app.use((req, res, next) => {
    let err = new Error("Não encontrado");
    err["status"] = 404;
    // Executa o próximo tratador na sequência (que no nosso caso
    // será um dos dois tratadores abaixo)
    next(err);
});
// Registra os tratadores de erro
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // Como aqui é apenas API, e não temos views (páginas web)...
    // Logo, precisamos devolver o erro na forma de JSON
    res.json(err.message);
    //res.render("shared/erro", {
    //	layout: "layout-externo",
    //	mensagem: err.message,
    //	// Como é um ambiente de desenvolvimento, deixa o objeto do erro
    //	// ir para a página, que possivelmente exibirá suas informações
    //	erro: err
    //});
    // Não estamos chamando next(err) aqui porque não temos mais
    // tratadores abaixo desse
});
app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), () => {
    debug("Express server listening on port " + server.address()["port"]);
});
//# sourceMappingURL=app.js.map