import express from 'express'
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import * as bodyParser from 'body-parser'
import router from './routes'

class App {
  private server: any

  constructor() {
    this.server = express()
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(bodyParser.json());
    this.server.use(router)
    this.server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));     
  }

  public Start = (port: number) => {
    return new Promise((resolve, reject) => {

      this.server.listen(
        port,
        () => {
          resolve(port)
        })
        .on('error', (err: object) => reject(err));
    })
  }
}

export default App;