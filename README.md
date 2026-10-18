![name](https://img.shields.io/badge/Project-BridgeMEI-purple?logo=github)

# BridgeMEI | Gestão Financeira
_Desenvolvido por: Enzo e Marcus_

*O BridgeMEI ainda não foi publicado, mas continuaremos com o projeto aqui no github mesmo após o lançamento.*

##  Sumário
  - [Sobre](#sobre)
  - [O que vem nele?](#o-que-vem-nele)
  - [Novidades](#novidades)
  - [Tecnologias utilizadas](#tecnologias-utilizadas)
  - [Como testar](#como-testar)
  - [Etapas de Desenvolvimento](#etapas)

## Sobre
BridgeMEI é um MVP(produto mínimo viável) de gestão financeira, o qual tem diversas funcionalidades.  
Por exemplo: você pode olhar o faturamento do seu negócio de forma dinâmica, fazer o controle do seu estoque e muito mais.

<img src="assets/dark-theme.png" width="400"/>

## Novidades
O BridgeMEI agora possui suporte ao Docker. 

Com o Docker, e possivel rodar os componentes do projeto usando apenas um comando no terminal.

## O que vem nele?
O BridgeMEI possui alguns recursos para facilitar a vida de um MEI, como:
- Dashboard
- Aba de Faturamento
- Guia de Aprendizado
- Controle de Estoque
- Controle de Vendas (em breve)

## Tecnologias utilizadas
* Front-end: React.js
* Back-end: C# (ASP.NET Core)
* Banco de Dados: MySQL

Outras Ferramentas:
* JWT authenticator
* Docker e Docker Compose

## Como testar
Pre-requisitos:
- Git
- Docker Engine ou Docker Desktop
- Docker Compose

1- Clone o repositório
```
git clone https://github.com/EnzoTakeshi588/bridgemei
cd bridgemei
```
2- Altere o ```.env```

Renomeie o arquivo ```.env.example``` para ```.env```

Edite o arquivo .env e defina senhas fortes para ```MYSQL_ROOT_PASSWORD``` e ```MYSQL_APP_PASSWORD```.

3- Inicialize o projeto

Na raiz do projeto, execute:
```
docker compose up -d --build
```
O Docker Compose ira carregar os componentes necessarios do projeto.

4- Acesse o site

Apos os servicos serem iniciados, acesse no seu navegador:  
http://localhost:5173

5- Primeiro acesso

Abra o site, realize o cadastro e entre com as suas credenciais.

Para rodar o projeto, use:
```
docker compose up
``` 

Para parar, use:
```
docker compose down
```

## Etapas
Projeto Inteiro:
* ~~Criação do BridgeMEI~~
* ~~Criação da tela Mei~~
* ~~Criação da API Login~~
* ~~Criação da tela Estoque~~
* ~~Criação da API Estoque~~
* ~~Tabela do estoque relacional~~
* ~~Adição de temas novos~~
* ~~Docker Compose~~
* **Implementacao Controle de Vendas**
* [...]
* Release BridgeMEI v1.0

_O BridgeMEI é um projeto escolar, feito por estudantes da Etec-SP_
