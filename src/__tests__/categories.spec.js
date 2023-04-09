const frisby = require("frisby");
require("dotenv").config();

const url = "http://localhost:3000";

describe("Endpoint para visualização de categorias", () => {
  
  it("Será validado que é impossivel listar as categorias sem o usuario validado", async () => {
    await frisby
      .get(`${url}/category`)
      .expect("status", 401)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe("Unauthorized user");
      });
  });

  it("Será validado que é impossivel listar as categorias com token invalido", async () => {
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: "asddasasdasdasdacacac",
            "Content-Type": "application/json",
          },
        },
      })
      .get(`${url}/category`)
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
          .get(`${url}/category`)
          .expect("status", 200)
          .then((response) => {
            const result = JSON.parse(response.body);
            expect(result[0].name).toBe("Entradas e Aperitivos");
            expect(result[0].parent).toBe(null);
          });
      });
  });
});
