import User from "../models/UserModel";
import Category from "../models/CategoryModel";

export const userStart = async () => {
  let users = await User.find();
  if (users.length === 0) {
    User.deleteMany({}).then(() => {
      User.create({
        userName: "admin",
        password: "adm123",
      });
    });
  }
};

export const categoryStart = async () => {
  let categories = await Category.find();
  if (categories.length === 0) {
    await Category.create([
      {
        name: "Entradas e Aperitivos",
        parent: null,
      },
      {
        name: "Pratos Principais",
        parent: null,
      },
      { name: "Bebidas", parent: null },
      { name: "Sobremesas", parent: null },
    ]);

    categories = await Category.find();

    await Category.create([
      {
        name: "Carnes",
        parent: categories[1],
      },
      {
        name: "Peixes",
        parent: categories[1],
      },
      {
        name: "Frangos",
        parent: categories[1],
      },
      {
        name: "Vegano e Vegetariano",
        parent: categories[1],
      },
      {
        name: "Bebidas Alcoolicas",
        parent: categories[2],
      },
      {
        name: "Sucos",
        parent: categories[2],
      },
      {
        name: "Refrigerantes",
        parent: categories[2],
      },
      {
        name: "Água",
        parent: categories[2],
      },
      {
        name: "Sorvetes",
        parent: categories[3],
      },
      {
        name: "Tortas e Bolos",
        parent: categories[3],
      },
    ]);
  };
};
