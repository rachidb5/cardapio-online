const frisby = require("frisby");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const url = "http://localhost:8080";

describe("Endpoint para cadastro de produtos", () => {
  let connection;
  let db;
  let categories;
  let categoryString;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DB_CONN || '',
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
          .expect("status", 201).then((response) => {
            const { json } = response;
            expect(json.name).toBe("pão de alho");
          });
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
  let products;
  let productString;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      process.env.DB_CONN,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    db = await connection.db();
  });

  beforeEach(async () => {
    products = await db.collection("products").find().toArray();
    productString = products[products.length - 1]._id.toString();
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
  it("Será validado que é possivel listar os produtos com o usuario validado", async () => {
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

describe("Endpoint para editar de produto", () => {
  let connection;
  let db;
  let products;
  let productString;
  let categories;
  let categoryString;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      process.env.DB_CONN,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    db = await connection.db();
  });

  beforeEach(async () => {
    products = await db.collection("products").find().toArray();
    productString = products[products.length - 1]._id.toString();
    categories = await db.collection("categories").find().toArray();
    categoryString = categories[0]._id.toString();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Será validado que é impossivel listar editar um produto sem o usuario validado", async () => {
    await frisby
      .patch(`${url}/product/${productString}`, {
        name: "pão de queijo",
        qty: 11,
        price: 102.9,
        categories: [categoryString],
      })
      .expect("status", 401)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe("Unauthorized user");
      });
  });

  it("Será validado que é impossivel editar produto com token invalido", async () => {
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: "asddasasdasdasdacacac",
            "Content-Type": "application/json",
          },
        },
      })
      .patch(`${url}/product/${productString}`, {
        name: "pão de queijo",
        qty: 11,
        price: 102.9,
        categories: [categoryString],
      })
      .expect("status", 400)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.error.message).toBe("jwt malformed");
      });
  });
 
  it("Será validado que é possivel editarum produto com o usuario validado", async () => {
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
          .patch(`${url}/product/${productString}`, {
            name: "pão de queijo",
            qty: 11,
            price: 102.9,
            categories: [categoryString],
          })
          .expect("status", 201)
          .then((response) => {
            const result = JSON.parse(response.body);
            expect(result.message).toBe("Product updated succesfully");
            expect(result._doc.name).toBe("pão de queijo");
          });
      });
  });
 
  it("Será validado que não é possivel editar um produto sem nome", async () => {
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
          .patch(`${url}/product/${productString}`, {
            name: "",
            qty: 11,
            price: 102.9,
            categories: [categoryString],
          })
          .expect("status", 400)
      });
  });

  it("Será validado que não é possivel editar um produto sem quantidade", async () => {
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
          .patch(`${url}/product/${productString}`, {
            name: "",
            qty: "",
            price: 102.9,
            categories: [categoryString],
          })
          .expect("status", 400)
      });
  });

  it("Será validado que não é possivel editar um produto sem preço", async () => {
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
          .patch(`${url}/product/${productString}`, {
            name: "",
            qty: 9,
            price: 112.9,
            categories: [categoryString],
          })
          .expect("status", 400)
      });
  });

  it("Será validado que não é possivel editar um produto sem categoria cadastrada", async () => {
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
          .patch(`${url}/product/${productString}`, {
            name: "",
            qty: 9,
            price: 112.9,
            categories: ["dfsdfsdf"],
          })
          .expect("status", 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result.message).toBe(
              "Invalid Entries."
            );
          });
      });
  });
 
  it("Será validado que não é possivel editar um produto sem categoria", async () => {
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
          .patch(`${url}/product/${productString}`, {
            name: "",
            qty: 9,
            price: 112.9,
            categories: [],
          })
          .expect("status", 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result.message).toBe(
              "Invalid Entries."
            );
          });
      });
  });

  it("Será validado que não é possivel editar um produto inexistente", async () => {
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
          .patch(`${url}/product/asdasd`, {
            name: "pão de frutas",
            qty: 9,
            price: 112.9,
            categories: [],
          })
          .expect("status", 404)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result.message).toBe(
              "Product not found"
            );
          });
      });
  });
});

describe("Endpoint para visualização de produto por id", () => {
  let connection;
  let db;
  let products;
  let productString;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      process.env.DB_CONN,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    db = await connection.db();
  });

  beforeEach(async () => {
    products = await db.collection("products").find().toArray();
    productString = products[products.length - 1]._id.toString();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Será validado que é impossivel listar deletar um produto sem o usuario validado", async () => {
    await frisby
      .delete(`${url}/product/${productString}`)
      .expect("status", 401)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe("Unauthorized user");
      });
  });

  it("Será validado que é impossivel deletar produto com token invalido", async () => {
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: "asddasasdasdasdacacac",
            "Content-Type": "application/json",
          },
        },
      })
      .delete(`${url}/product/${productString}`)
      .expect("status", 400);
  });
  it("Será validado que é possivel deletar o produto com o usuario validado", async () => {
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
          .delete(`${url}/product/${productString}`)
          .expect("status", 200)
          .then((response) => {
            const result = JSON.parse(response.body);
            expect(result.message).toBe("Product deleted succesfully");
          });
      });
  });
});