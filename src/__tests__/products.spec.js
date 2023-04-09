const frisby = require("frisby");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const url = "http://localhost:3000";

describe("Endpoint para cadastro de produtos", () => {
  let connection;
  let db;
  let categories;
  let categoryString;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      `mongodb+srv://jordanrachid:${process.env.DB_PWD}@cluster0.tc6clya.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    db = await connection.db();
  });
  beforeEach(async () => {
    categories = await db.collection("categories").find().toArray();
    categoryString = categories[0]._id.toString();
  });
  afterAll(async () => {
    await connection.close();
  });
  it("Será validado que não é possivel cadastrar produtos sem categoria", async () => {
    let result;
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "adm123",
      })
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                "Content-Type": "application/json",
              },
            },
          })
          .post(`${url}/product`, {
            name: "pão de alho",
            qty: 20,
            price: 119.9,
            categories: [],
          })
          .expect("status", 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result.message).toBe("Invalid Entries.");
          });
      });
  });
  it("Será validado que não é possivel cadastrar produtos sem categoria já cadastrada", async () => {
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "adm123",
      })
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                "Content-Type": "application/json",
              },
            },
          })
          .post(`${url}/product`, {
            name: "risoto de camarão",
            qty: 10,
            price: 119.9,
            categories: ["dfsdfsdf"],
          })
          .expect("status", 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result.error).toBe(
              "Category with id: dfsdfsdf doesnt exist"
            );
          });
      });
  });

  it("Será validado que é possivel cadastrar produtos com usuario cadastrado", async () => {
    const categories = await db.collection("categories").find().toArray();
    const categoryString = categories[0]._id.toString();

    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "adm123",
      })
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                "Content-Type": "application/json",
              },
            },
          })
          .post(`${url}/product`, {
            name: "pão de alho",
            qty: 10,
            price: 119.9,
            categories: [categoryString],
          })
          .expect("status", 201);
      });
  });
  it("Será validado que não é possivel cadastrar produtos sem preço", async () => {
    let categoryId;
    let result;
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "adm123",
      })
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                "Content-Type": "application/json",
              },
            },
          })
          .post(`${url}/product`, {
            name: "pão de alho",
            qty: 10,
            price: "",
            categories: [categoryString],
          })
          .expect("status", 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result.message).toBe("Invalid Entries.");
          });
      });
  });
  it("Será validado que não é possivel cadastrar produtos sem quantidade", async () => {
    let result;
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "adm123",
      })
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                "Content-Type": "application/json",
              },
            },
          })
          .post(`${url}/product`, {
            name: "pão de alho",
            qty: "",
            price: 119.9,
            categories: [categoryString],
          })
          .expect("status", 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result.message).toBe("Invalid Entries.");
          });
      });
  });
});

describe("Endpoint para visualização de produtos", () => {
  it("Será validado que é impossivel listar as produtos sem o usuario validado", async () => {
    await frisby
      .get(`${url}/product`)
      .expect("status", 401)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe("Unauthorized user");
      });
  });

  it("Será validado que é impossivel listar os produtos com token invalido", async () => {
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: "asddasasdasdasdacacac",
            "Content-Type": "application/json",
          },
        },
      })
      .get(`${url}/product`)
      .expect("status", 400);
  });
  it("Será validado que é possivel listar produtos com o usuario validado", async () => {
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "adm123",
      })
      .expect("status", 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                "Content-Type": "application/json",
              },
            },
          })
          .get(`${url}/product`)
          .expect("status", 200)
          .then((response) => {
            const result = JSON.parse(response.body);
            expect(result[result.length - 1].name).toBe("pão de alho");
            expect(result[result.length - 1].qty).toBe(10);
            expect(result[result.length - 1].price).toBe(119.9);
          });
      });
  });
});

describe("Endpoint para visualização de produto por id", () => {
  let connection;
  let db;
  let categories;
  let categoryString;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      `mongodb+srv://jordanrachid:${process.env.DB_PWD}@cluster0.tc6clya.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    db = await connection.db();
  });

  beforeEach(async () => {
    products = await db.collection("products").find().toArray();
    productString = products[products.length-1]._id.toString();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Será validado que é impossivel listar visualizar um produto sem o usuario validado", async () => {
    await frisby
      .get(`${url}/product/${productString}`)
      .expect("status", 401)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe("Unauthorized user");
      });
  });

  it("Será validado que é impossivel visualizar produto com token invalido", async () => {
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: "asddasasdasdasdacacac",
            "Content-Type": "application/json",
          },
        },
      })
      .get(`${url}/product/${productString}`)
      .expect("status", 400);
  });
  it("Será validado que é possivel listar as categorias com o usuario validado", async () => {
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "adm123",
      })
      .expect("status", 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                "Content-Type": "application/json",
              },
            },
          })
          .get(`${url}/product/${productString}`)
          .expect("status", 200)
          .then((response) => {
            const result = JSON.parse(response.body);
            expect(result.name).toBe("pão de alho");
            expect(result.qty).toBe(10);
            expect(result.price).toBe(119.9);
          });
      });
  });
});
