const frisby = require("frisby");
require("dotenv").config();

const url = "http://localhost:3000";

describe("1 - Endpoint para login e autenticação do usuario", () => {
  it("Será validado que é impossivel efetuar o login com senha incorreta", async () => {
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "123adm",
      })
      .expect("status", 401)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe("Invalid user or password.");
      });
  });
  it("Será validado que é impossivel efetuar o login com usuario incorreto", async () => {
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "adm",
        password: "adm123",
      })
      .expect("status", 401)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe("Invalid user or password.");
      });
  });
  it("Será validado que é possivel efetuar o login com usuario e senha corretos", async () => {
    await frisby
      .post(`${url}/auth/login/`, {
        userName: "admin",
        password: "adm123",
      })
      .expect("status", 200);
  });
});
