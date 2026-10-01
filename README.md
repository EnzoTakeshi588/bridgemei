![name](https://img.shields.io/badge/Project-BridgeMEI-purple?logo=github)

# BridgeMEI | Gestao Financeira
_Desenvolvido por: Enzo e Marcus_

*O BridgeMEI ainda não foi publicado, mas continuaremos com o projeto aqui no github mesmo após o lançamento.*

##  Sumário
  - [Sobre](#sobre)
  - [O que vem nele?](#o-que-vem-nele)
  - [Novidades](#Novidades)
  - [Tecnologias utilizadas](#tecnologias-utilizadas)
  - [Como testar](#como-testar)
  - [Etapas de Desenvolvimento](#etapas)

## Sobre
BridgeMEI é um MVP(produto mínimo viável) de gestão financeira, o qual tem diversas funcionalidades. Por exemplo: você pode olhar o faturamento do seu negócio de forma dinâmica, fazer o controle do seu estoque e muito mais.
## Novidades
O BridgeMEI agora vem com tres adicoes: 
- Identidade Visual nova;
- Tema novo;
- Traducao para o ingles  

Tema Escuro:  
<img src="assets/dark-theme.png" width="400"/>

Tema Claro:  
<img src="assets/light-theme.png" width="400"/>

## O que vem nele?
O BridgeMEI possui alguns recursos para facilitar a vida de um MEI, como:
- Dashboard
- Faturamento
- Guia de Aprendizado
- Controle de Estoque

## Tecnologias utilizadas
* Front-end em React (JS)
* Back-end em C# (ASP.NET Core)
* Banco de Dados em SQL
* Autenticação em JWT
## Como testar
Para testar o projeto, você precisa verificar primeiro se as dependências
abaixo estão instaladas no seu computador:
- .NET (versão 10.0)
- Node.js (24.15 LTS)
- MySQL 8.0.46

Usando os seguintes comandos no PowerShell ou no seu terminal:
``` 
dotnet --list-sdks (.NET)
node -v npm -v (Node.js)
mysql --version 
```

Instruções para rodar:
1. Abra um terminal na pasta do projeto e digite ` npm install ` para os pacotes do ` .jsx `  
2. Depois, rode ` npm run dev ` para rodar o visual do site  
3. Abra um outro terminal dentro de ` pasta-api ` e rode:
```
dotnet restore
dotnet run
```  
4. Abra um ultimo terminal dentro de ` EstoqueApi ` e rode os mesmos comandos do passo 3  
5. Faca o primeiro cadastro e depois faca o Login  
_Importante: A API de Login funciona com banco em memoria, isso significa que voce tem que fazer o cadastro toda vez que ligar a API_

## Etapas
Projeto Inteiro:
* ~~Criacao do BridgeMEI~~
* ~~Criacao da tela Mei~~
* ~~Criacao da API Login~~
* ~~Criacao da tela Estoque~~
* ~~Criacao da API Estoque~~
* ~~Tabela do estoque relacional~~
* ~~Adicao de temas novos~~
* **Importacao de arquivos (Excel e .csv)**
* [...]
* Publicacao App BridgeMEI

Branch: [...]

_O BridgeMEI é um projeto escolar, feito por estudantes da Etec-SP_