# Cardapio-api

Bem vindo à API de cardapio online. A seguir, uma apresentação do projeto com orientações e apresentações das ferramentas.


## Como executar localmente
Primeiro, vamos baixar o projeto. Execute o comando abaixo na pasta onde você deseja fazer o download.

Execute o comando a seguir na pasta em que vicê deseja salvar o projeto

```
git clone https://github.com/rachidb5/cardapio-online.git
```

Depois entraremos na pasta do projteo

```bash
cd cardapio-online
```

Antes de instalar as dependencias e iniciar o projeto, temos que definir duas variaveis de ambiente.

Na pasta raiz do projeto, crie um arquivo chamado ```.env```.

Dentro desse arquivo.

```
DB_CONN=***string de conexão com o banco de dados mongodb***
JWT_SECRET=***você escolhe chave secreta para geração do token de autenticação***
```

Então, instalamos as dependencias

```bash
npm install
```

Iniciando o projeto

```bash
npm run build
```

E depois

```bash
npm start
```
OU


Se quiser executar o ambiente de desenvolvimento

```
npm run dev
```

Agora, a API estará disponivel em:

```
http://localhost:8080
```

## Endpoints


## Deploy

Também é possivel acessar o projeto aqui: [Aqui](https://cardapio-app.fly.dev/swagger/)
