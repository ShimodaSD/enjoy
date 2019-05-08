CREATE SCHEMA banco_api;

USE banco_api;

CREATE TABLE curso (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(50) NOT NULL,
  descricao varchar(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UNIQUE (nome)
);

-- SE OCORRER ALGUM PROBLEMA DE PERMISSÃO OU DE ACESSO PELO NODE
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'
