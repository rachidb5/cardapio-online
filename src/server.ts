import app from './index'
import mongoose from 'mongoose';
import User from './models/UserModel';
import Category from './models/CategoryModel';
require('dotenv').config();
const port = parseInt(process.env.PORT || '3000');

mongoose.connect(`mongodb+srv://jordanrachid:${process.env.DB_PWD}@cluster0.tc6clya.mongodb.net/?retryWrites=true&w=majority`).then(() => console.log("conectado")).catch((e: string) =>{
  console.log("algo deu errado erro: "+e)
})

User.deleteMany({}).then(() => {
  User.create({
    userName:"admin",
    password:"adm123"
  })
});

Category.deleteMany({}).then(() => {
  Category.create([{
    name:"Aperitivos e petiscos",
    parent:null
  },{
    name:"Pratos Principais",
    parent:null
  },
   {
    name:"Massas",
    parent:null
  },
   {
    name:"Bebidas",
    parent:null
  },
   {
    name:"Sobremesas",
    parent:null
  },
])
}).then(() =>{

})

const server = new app().Start(port)
  .then((port: any) => console.log(`Server running on port ${port}`))
  .catch((error: any) => {
    console.log(error)
    process.exit(1);
  });

export default server;