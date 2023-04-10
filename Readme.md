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

Construindo

```bash
npm run build
```
Iniciando o projeto

```bash
npm start
```
OU


Se quiser executar o ambiente de desenvolvimento

```
npm run dev
```

Para executar os testes:

```
npm run test
```


Agora, a API estará disponivel em:

```
http://localhost:8080
```

## Endpoints

Antes de conhecer os endpoints, vamos dar uma olhada na documentação que está disponivel via swagger na url:

```
http://localhost:8080/swagger
```

Agora vamos conhecer os endpoints:

### Login

Disponivel em:
```
http://localhost:8080/auth/login
```

| Método | Descrição |
|---|---|
| `POST` | Utilizado para autenticar o usuario |

No body da requisição:

```
{
  "userName": "admin",
  "password": "adm123"
}
```
| Código | Descrição |
|---|---|
| `200` | Requisição executada com sucesso (success).|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|

resposta: 

```
{
	"token": Bearer [access_token]
}
```
### Categorias

Disponivel em:
```
http://localhost:8080/category
```

| Método | Descrição |
|---|---| |
| `GET` | Retorna a lista de categorias |

No cabeçalho da requisição, você usa o token gerado no endpoint de autenticação:

```
{
  "Authorization": Bearer [access_token],
}
```

| Código | Descrição |
|---|---|
| `200` | Requisição executada com sucesso (success).|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|

exemplo de resposta: 

```
[
  {
    "_id": "6431b4a569e0eb46011b1080",
    "name": "Entradas e Aperitivos",
    "parent": null
  },
  {
    "_id": "6431b4a569e0eb46011b1081",
    "name": "Pratos Principais",
    "parent": null
  },
  {
    "_id": "6431b4a569e0eb46011b1083",
    "name": "Sobremesas",
    "parent": null
  },
  {
    "_id": "6431b4a569e0eb46011b1082",
    "name": "Bebidas",
    "parent": null
  },
  {
    "_id": "6431b4a669e0eb46011b1089",
    "name": "Carnes",
    "parent": "6431b4a569e0eb46011b1081"
  },
  {
    "_id": "6431b4a669e0eb46011b108a",
    "name": "Peixes",
    "parent": "6431b4a569e0eb46011b1081"
  },
  {
    "_id": "6431b4a669e0eb46011b108b",
    "name": "Frangos",
    "parent": "6431b4a569e0eb46011b1081"
  },
  {
    "_id": "6431b4a669e0eb46011b108f",
    "name": "Refrigerantes",
    "parent": "6431b4a569e0eb46011b1083"
  },
  {
    "_id": "6431b4a669e0eb46011b108e",
    "name": "Sucos",
    "parent": "6431b4a569e0eb46011b1083"
  },
  {
    "_id": "6431b4a669e0eb46011b108d",
    "name": "Bebidas Alcoolicas",
    "parent": "6431b4a569e0eb46011b1083"
  },
  {
    "_id": "6431b4a669e0eb46011b1091",
    "name": "Sorvetes",
    "parent": "6431b4a569e0eb46011b1082"
  },
  {
    "_id": "6431b4a669e0eb46011b1092",
    "name": "Tortas e Bolos",
    "parent": "6431b4a569e0eb46011b1082"
  },
  {
    "_id": "6431b4a669e0eb46011b108c",
    "name": "Vegano e Vegetariano",
    "parent": "6431b4a569e0eb46011b1081"
  },
  {
    "_id": "6431b4a669e0eb46011b1090",
    "name": "Água",
    "parent": "6431b4a569e0eb46011b1083"
  }
]
```
### Produtos
No cabeçalho de todas as requisição, você usa o token gerado no endpoint de autenticação:

```
{
  "Authorization": Bearer [access_token],
}

```
Disponivel em:

```
http://localhost:8080/product
```

| Método | Descrição |
|---|---|
| `GET` | Retorna informações de um ou mais registros. |
| `POST` | Utilizado para criar um novo registro. |
| `PATCH` | Atualiza dados de um registro ou altera sua situação. |
| `DELETE` | Remove um registro do sistema. |

#### Lista de produtos (GET)

| Código | Descrição |
|---|---|
| `200` | Requisição executada com sucesso (success).|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|

exemplo de resposta: 
```
[
  {
    "_id": "64322a2dc25fe7ca9955ba00",
    "name": "pão de alho",
    "qty": 10,
    "price": 119.9,
    "categories": [
      "6431b4a569e0eb46011b1080"
    ]
  },
  {
    "_id": "64322b54c25fe7ca9955ba0c",
    "name": "pão de queijo",
    "qty": 11,
    "price": 102.5,
    "categories": [
      "6431b4a569e0eb46011b1080"
    ]
  }]
```
#### Cadastro de produtos (POST)

| Código | Descrição |
|---|---|
| `201` | Produto criado com sucesso.|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|

No body da requisição:
```
{
  "name": "string",
  "qty": "number",
  "price": "number",
  "categories": [
    category._id
  ]
}
```
#### Exibição de produto simples (GET)

Disponivel em:

```
http://localhost:8080/product/{product.id}
```

| Código | Descrição |
|---|---|
| `200` | Requisição executada com sucesso (success).|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|

exemplo de resposta: 

```
  {
    "_id": "64322a2dc25fe7ca9955ba00",
    "name": "pão de alho",
    "qty": 10,
    "price": 119.9,
    "categories": [
      "6431b4a569e0eb46011b1080"
    ]
  },
```

#### Exclusão de produto simples (DELETE)

Disponivel em:

```
http://localhost:8080/product/{product.id}
```

| Código | Descrição |
|---|---|
| `200` | Requisição executada com sucesso (success).|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|

#### Atualização de produto simples (PATCH)

Disponivel em:

```
http://localhost:8080/product/{product.id}
```

| Código | Descrição |
|---|---|
| `201` | Produto atualizado com sucesso (success).|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|

No body da requisição:
```
{
  "name": "string",
  "qty": "number",
  "price": "number",
  "categories": [
    category._id
  ]
}
```

## Deploy

Também é possivel acessar o projeto aqui: [Aqui](https://cardapio-app.fly.dev/swagger/)
